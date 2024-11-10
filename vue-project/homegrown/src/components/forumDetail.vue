<template>
    <button @click="goBack">Go Back</button>
  <div>
    {{forumTitle}}
  </div>

  </template>
  
  
  <script>
  import { doc, getDoc } from "firebase/firestore";
  import { db } from "../firebase/initialize";

  export default {
    data(){
      return {
        forumID: this.$route.params.id,
        forumTitle: '',
        forumDesc: '',
        comments:[],
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
          console.log(this.forumTitle)
        }
      }catch (error){
        console.log("error", error)
        }
      },
    }
  }
  </script>