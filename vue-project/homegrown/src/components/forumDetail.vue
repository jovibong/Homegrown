<template>
  <div class="col-3 m-3 mt-4">
    <div class="btn btn-warning text-dark" @click="goBack">
      <i class="bi bi-arrow-left"></i>
      <span class="d-none d-lg-inline">Back to all forums</span>
      <span class="d-inline d-lg-none">Back</span>
    </div>
  </div>

  <div class="forum-text">
    <div class="title mb-3 display-4 h2">
      {{ forumTitle }}
    </div>

    <div class="desc text-muted mb-4 h5">
      {{ forumDesc }}
    </div>
  </div>



  <div class="comments-header">
    <h3 class="text-muted"> Comments </h3>
    <hr>

    <div class="dropdown ms-auto">

      <button type="button" class="btn btn-primary ms-auto dropdown-toggle" data-bs-toggle="dropdown"
        aria-expanded="false" data-bs-auto-close="outside">
        Add Comment
      </button>

      <form class="dropdown-menu p-4" @submit.prevent="addComment">
        <div class="mb-3">
          <label for="comment" class="form-label">Comment</label>
          <textarea rows="4" cols="50" id="comment" v-model="userComment" class="form-control" required></textarea>
        </div>

        <button type="submit" class="btn btn-primary"> Post </button>
      </form>
    </div>
  </div>

  <hr>

  <loading-animation v-if="comments_loading"></loading-animation>
  <div v-if="!comments_loading">
    <div v-if="comments.length == 0" class="text-muted mb-4 h5 text-center"> No comments yet.
    </div>

    <div v-else>
      <div v-for="comment in comments" :key="comment.name" class="indiv-comment text-muted h5 m-3">
        <div class="left-section p-3">
          <img :src="comment.poster.profilePic" class="profile-pic" />
        </div>

        <div class="comment-content">
          <div class="username">
            <span class="username-text">{{ comment.poster.username }}</span> says..
          </div>
          <div class="comment-text">
            {{ comment.desc }}
          </div>
        </div>

      </div>
    </div>

  </div>

</template>
  
  
<script>
  import 'bootstrap/dist/js/bootstrap';
  import 'bootstrap/dist/css/bootstrap.css'
  import { doc, getDoc, collection, addDoc, getDocs } from "firebase/firestore";
  import { db } from "../firebase/initialize";
  import loadingAnimation from "../components/loadingAnimation.vue";


  export default {
    data(){
      return {
        forumID: this.$route.params.id,
        forumTitle: '',
        forumDesc: '',
        comments:[],

        userComment: '',
        comments_loading: true
      }
    },

    components: {
      loadingAnimation
    },

    mounted(){
      this.getForum()
    },

    methods: {
      goBack() {
        this.$router.go(-1);  // Goes back one step in the browser history
      },

      async fetchUserProfile(userID) {
        console.log(userID)
        try {
          const userDoc = await getDoc(doc(db, "profiles", userID)); // Fetch the user document
          if (userDoc.exists()) {
            const data = userDoc.data();

            // Return the user profile information as an object
            return {
              name: data.name || "", // Provide a default empty string if name is missing
              username: data.username || "", // Default to empty string if username is missing
              profilePic: data.profileImageUrl || require('@/img/blankprofile.png'), // Default to a placeholder if no image
            };
          } else {
            console.log("User not found", userDoc.data());
            return null; // Return null if the document doesn't exist
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          return null; // Return null in case of an error
        }
      },

      async getForum() {
        try {
          console.log("Firestore instance:", db); // Debugging: Check db initialization
          const docRef = doc(db, "forums", this.forumID); // Create a reference to the specific forum document
          const docSnap = await getDoc(docRef); // Get the document snapshot

          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            this.forumTitle = docSnap.data().title;
            this.forumDesc = docSnap.data().description;

            // Fetch user profile of the user who posted the forum
            const userInfo = await this.fetchUserProfile(docSnap.data().postedBy); // Fetch the user profile
            console.log("forum user", userInfo)
            this.postedBy = {
              uid: docSnap.data().postedBy,
              username: userInfo.username,
              profilePic: userInfo.profilePic
            };

            // Now fetch the comments
            this.getComments(this.forumID);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      },


      async getComments(forumID) {
        const forumRef = doc(db, "forums", forumID);
        const commentsRef = collection(forumRef, "comments");

        try {
          // Get all documents in the "comments" subcollection
          const querySnapshot = await getDocs(commentsRef);

          // Loop through the documents and extract data
          for (const doc of querySnapshot.docs) {

            console.log("Fetching profile for user:", doc.data().poster);
            console.log(typeof(doc.data().poster))

            const userInfo = await this.fetchUserProfile(doc.data().poster); // Fetch user profile for each comment

            console.log("userInfo fetched:", userInfo);
            
            // Push comment data along with user profile
            this.comments.push({
              id: doc.id,
              desc: doc.data().description,
              poster: {
                uid: doc.data().poster,
                username: userInfo.username,
                profilePic: userInfo.profilePic
              }
            });
          }

          console.log("Comments retrieved:", this.comments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        } finally {
          this.comments_loading = false;
        }
      },

      async addComment() {
        const sessionUser = await(JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')));
        const forumRef = doc(db, "forums", this.forumID);
        const commentsRef = collection(forumRef, "comments");

        const commentData = {
        description: this.userComment,
        poster: sessionUser.uid,
      };

        try{
          const docRef = await addDoc(commentsRef, commentData); // Add the document
          console.log("Comment created with ID: ", docRef.id); // Log the new document ID
          window.location.reload();

        }catch (error) {
          console.error("Error posting comment: ", error);
        }
      },

    }
  }
  
  
</script>

<style scoped>

.forum-text {
  padding: 10px;
}

.forum-text .title {
  font-weight: bold;
}

.forum-text .desc {
  color: #555;
}

.comments-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#comment {
  width:200px;
}

.add-comment-btn {
  background-color: #525fe1;
  color: white;
  font-size: 14px;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
}


.indiv-comment {
  display: flex;
  align-items: center;
  /* Vertically align content */
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  background-color: #f9f9f9;
  border-radius:55px;
  border: 2px solid #525fe1;
}

.left-section {
    width: 100px;  /* 30% of the width */
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;  /* Center profile image */
    margin-left: 10px;
}

.profile-pic {
    width: 130px;
    height: 130px;
    object-fit: cover;
    border-radius:50%;
    padding: 10px;
}

.comment-content {
  display: flex;
  flex-direction: column; /* Stack content vertically */
  padding-left: 40px;
}

.username {
  font-weight: bold; 
  margin-bottom: 10px; /* Adds space between username and comment text */
}


.username-text {
  font-weight: bold; /* Makes the username bold */
  color: black; /* Change the color of the username */
}

.comment-text {
  color: #6c757d; /* Optional: change color for comment text */
}


</style>