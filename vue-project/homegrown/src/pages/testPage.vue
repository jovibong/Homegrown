<template>
  <div>
    <h1>Upload Chats and Users to Firebase</h1>
    <button @click="importData">Import Data</button>
  </div>
</template>

<script>
import { db } from '../firebase/initialize';
import { collection, doc, writeBatch } from 'firebase/firestore';
import chatsData from '../json/chats.json';

export default {
  methods: {
    async importData() {
      try {
        const chatBatch = writeBatch(db);
        const userBatch = writeBatch(db);
        let chatBatchCount = 0;
        let userBatchCount = 0;

        // Process chats with conversations
        for (const chat of chatsData.chats) {
          const chatId = `chat_${chat.chat_id.slice(-3).padStart(5, '0')}`;
          
          // Prepare chat data, omitting group_members if chat_type is "contact"
          const chatData = {
            chat_name: chat.chat_name,
            chat_type: chat.chat_type,
            chat_img: chat.chat_img,
            ...(chat.chat_type === "group" && {
              group_members: chat.group_members
                ? chat.group_members.map(member => `user_${member.slice(-3).padStart(5, '0')}`)
                : []
            })
          };

          const chatRef = doc(db, 'chats', chatId);
          chatBatch.set(chatRef, chatData);
          chatBatchCount++;

          // Process conversations
          for (const conversation of chat.conversations) {
            const messageId = `msg_${conversation.message_id.slice(-3).padStart(5, '0')}`;
            const messageData = {
              message: conversation.message,
              timestamp: conversation.timestamp,
              user: `user_${conversation.user.slice(-3).padStart(5, '0')}`
            };

            const conversationRef = doc(collection(chatRef, 'conversations'), messageId);
            chatBatch.set(conversationRef, messageData);
            chatBatchCount++;

            if (chatBatchCount >= 500) {
              await chatBatch.commit();
              console.log(`Committed chat batch with ${chatBatchCount} writes.`);
              chatBatchCount = 0;
            }
          }
        }

        if (chatBatchCount > 0) {
          await chatBatch.commit();
          console.log(`Committed final chat batch with ${chatBatchCount} writes.`);
        }

        // Process users
        for (const userId in chatsData.all_users) {
          const user = chatsData.all_users[userId];
          const formattedUserId = `user_${userId.slice(-3).padStart(5, '0')}`;
          const userData = {
            name: user.name,
            profile_picture: user.profile_picture
          };

          const userRef = doc(db, 'users', formattedUserId);
          userBatch.set(userRef, userData);
          userBatchCount++;

          if (userBatchCount >= 500) {
            await userBatch.commit();
            console.log(`Committed user batch with ${userBatchCount} writes.`);
            userBatchCount = 0;
          }
        }

        if (userBatchCount > 0) {
          await userBatch.commit();
          console.log(`Committed final user batch with ${userBatchCount} writes.`);
        }

        console.log("Data import completed successfully!");
      } catch (error) {
        console.error("Error uploading data:", error);
      }
    }
  }
};


</script>
