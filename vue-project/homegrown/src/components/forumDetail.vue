<template>
  <div class="col-3 m-3 mt-4">
    <div class="btn btn-warning text-dark" @click="goBack">
      <i class="bi bi-arrow-left"></i>
      <span class="d-none d-lg-inline">Back to all forums</span>
      <span class="d-inline d-lg-none">Back</span>
    </div>
  </div>

  <div class="container main-post">
    <div class="text-primary fw-bold mb-3 display-4">
      {{ forumTitle }}
    </div>

    <div class="text-muted mb-4 h5">
      {{ forumDesc }}
    </div>
  </div>



  <div class="comments-header">
    <h3 class="text-muted"> Comments </h3>

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


    <hr>
  </div>

  <div class="allComments">
    <div v-if="comments.length == 0" class="text-muted mb-4 h5 text-center"> No comments yet.
    </div>

    <div v-else>
      <div v-for="comment in comments" :key="comment.name" class="indiv-comment text-muted mb-4 h5">
        <div class="comment-text">
          {{ comment.desc }}
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

  export default {
    data(){
      return {
        forumID: this.$route.params.id,
        forumTitle: '',
        forumDesc: '',
        comments:[],

        userComment: ''
      }
    },

    mounted(){
      this.getForum()
    },

    methods: {
      goBack() {
        this.$router.go(-1);  // Goes back one step in the browser history
      },

      async getForum (){

      try {
        console.log("Firestore instance:", db); // Debugging: Check db initialization
        const docRef = doc(db, "forums", this.forumID); // Create a reference to the specific event document
        const docSnap = await getDoc(docRef); // Get the document snapshot

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          this.forumTitle = docSnap.data().title;
          this.forumDesc = docSnap.data().description
          console.log(this.forumTitle)

          this.getComments(this.forumID);
        }
      }catch (error){
        console.log("error", error)
        }
      },

      async getComments(forumID){
        
        const forumRef = doc(db, "forums", forumID);
        const commentsRef = collection(forumRef, "comments");
        try {
        // Get all documents in the "groups" subcollection
        const querySnapshot = await getDocs(commentsRef);

        // Loop through the documents and extract data
        querySnapshot.forEach((doc) => {

          this.comments.push({
            id: doc.id,
            desc: doc.data().description,
            user: doc.data().user
          });
        });

        console.log("Comments retrieved:", this.comments);
        return
      } catch (error) {
        console.error("Error fetching groups: ", error);
      }

      },

      async addComment() {
        const sessionUser = await(JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')));
        const forumRef = doc(db, "forums", this.forumID);
        const commentsRef = collection(forumRef, "comments");

        const commentData = {
        description: this.userComment,
        user: sessionUser.uid,
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
.main-post {
 border: 2px solid blue;
 border-radius: 20px;
 margin-bottom: 10px;
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
border: 2px solid black;
padding: 10px;
margin: 10px;
}

.comment-text {
  padding-left: 80px;
}

</style>