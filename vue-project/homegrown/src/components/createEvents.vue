<template>
    <form @submit.prevent="submitInput">
        <!-- Event Name -->
        <div class="row mb-3">
            <label for="title" class="col-sm-2 col-form-label"> Name</label>
            <div class="col-sm-10">
                <input id="title" v-model="eventTitle" type="text" class="form-control" />
            </div>
        </div>

        <!-- Event Category -->
        <div class="row mb-3">
            <label for="eventCategory" class="col-sm-2 col-form-label">Event Category</label>
            <div class="col-sm-4">
            <select id="eventCategory" v-model="eventCategory" class="form-select">
                <option disabled value="">Select a category</option>
                <option value="Holiday">Holiday</option>
                <option value="Festivals">Festivals</option>
                <option value="Outdoors">Outdoors</option>
                <option value="Cultural">Cultural</option>
                <option value="Meet-ups">Meet-ups</option>
            </select>
            </div>
        </div>
        
        <!-- Description -->
        <div class="row mb-3">
            <label for="description" class="col-sm-2 col-form-label">Description</label>
            <div class="col-sm-10">
                <textarea rows="4" cols="50" id="description" v-model="eventDescription"
                    class="form-control"></textarea>

            </div>
        </div>

        <!-- Image Upload -->
        <!-- <div class="row mb-3">
            <label for="image" class="col-sm-2 col-form-label">Image</label>
            <div class="col-sm-10">
                <input id="image" type="file" class="form-control" @change="uploadImage" />
            </div>
        </div> -->

        <!-- Date and Time -->
        <div class="row mb-3">
            <label for="date" class="col-sm-2 col-form-label">Date</label>
            <div class="col-sm-4">
                <input id="date" v-model="eventDate" type="date" class="form-control" />
            </div>

            <label for="time" class="col-sm-2 col-form-label">Time</label>
            <div class="col-sm-4">
                <input id="time" v-model="eventTime" type="time" class="form-control" />
            </div>
        </div>

        <!-- Location -->
        <div class="row mb-3">
            <label for="location" class="col-sm-2 col-form-label">Location</label>
            <div class="col-sm-10">
                <input id="location" v-model="eventLocation" type="text" class="form-control" />
            </div>
        </div>

        <div id="submitButton">
            <button @click="submitInput" class="btn btn-warning mt-3"> Submit </button>
        </div>
    </form>
</template>
    
<script>
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase/initialize'
// import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"; 

export default {

    data() {
        return {
            eventTitle: "",
            eventDescription: "",
            eventDate: null,
            eventTime: null,
            eventLocation: "",
            createdBy: "user001",
            file: "",
            imageURL: "",
            eventCategory: ""
        }
    },

    methods: {
        async submitInput(e) {
          console.log(e.value);

            const docData = {
                name: this.eventTitle,
                description: this.eventDescription,
                date: Timestamp.fromDate(new Date(this.eventDate)),
                location: this.eventLocation,
                // imageURL: this.imageURL,
                createdBy: this.createdBy,
                category: this.category

                }

            // Add a new document in collection "events"
            const docRef = await addDoc(collection(db, "events"), docData);
            console.log("Document written with ID: ", docRef.id);
            this.eventID = docRef.id;
            this.$router.push({ name: 'eventDetail', params: { id: this.eventID } });
            console.log(this.eventID)
        },

        // async uploadImage(event) {
        //     const storage = getStorage();
        //     const file = event.target.files[0];

        //     if (file) {
        //         const storageRef = ref(storage, `eventImages/${file.name}`);

        //         // Create file metadata including the content type
        //         const metadata = {
        //             name: `${this.eventTitle} Image`,
        //             contentType: 'image/jpeg',
        //         };

        //         const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        //         // Register three observers:
        //         // 1. 'state_changed' observer, called any time the state changes
        //         // 2. Error observer, called on failure
        //         // 3. Completion observer, called on successful completion
        //         uploadTask.on('state_changed',
        //             (snapshot) => {
        //                 // Observe state change events such as progress, pause, and resume
        //                 // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        //                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //                 console.log('Upload is ' + progress + '% done');
        //                 switch (snapshot.state) {
        //                     case 'paused':
        //                         console.log('Upload is paused');
        //                         break;
        //                     case 'running':
        //                         console.log('Upload is running');
        //                         break;
        //                 }
        //             },
        //             (error) => {
        //                 // Handle unsuccessful uploads
        //                 console.error("Upload unsuccessful:", error)
        //             },
        //             () => {
        //                 // Handle successful uploads on complete
        //                 // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //                     console.log('File available at', downloadURL);
        //                     this.imageURL = downloadURL;
        //                 });
        //             }
        //         )
        //     }else{
        //         console.log(`cannot get image. file: ${file}`)
        //     } 
        // }
    }
}
</script>

<style scoped>
@import "../css/events.css";
</style>
    