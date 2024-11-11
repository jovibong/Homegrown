<template>
    <form @submit.prevent="submitInput">
        <!-- Event Name -->
        <div class="row mb-3">
        <label for="title" class="col-sm-2 col-form-label"> Event Name</label>
            <div class="col-sm-10">
                <input id="title" v-model="eventTitle" type="text" class="form-control" required/>
                <div v-if="titleError" class="text-danger">Event name is required and should not exceed 30 characters</div>
            </div>
        </div>

        <!-- Event Category -->
        <div class="row mb-3">
            <label for="eventCategory" class="col-sm-2 col-form-label">Event Category</label>
            <div class="col-sm-4">
                <select id="eventCategory" v-model="eventCategory" class="form-select" required>
                    <option disabled value="">Select a category</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Festivals">Festivals</option>
                    <option value="Outdoors">Outdoors</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Meet-ups">Meet-ups</option>
                    <option value="Others">Others</option>
                </select>
                <div v-if="categoryError" class="text-danger">Category is required</div>
            </div>
        </div>

        <!-- Description -->
        <div class="row mb-3">
            <label for="description" class="col-sm-2 col-form-label">Description</label>
            <div class="col-sm-10">
                <textarea rows="4" cols="50" id="description" v-model="eventDescription"
                    class="form-control" required></textarea>
                <div v-if="descError" class="text-danger">Description is required</div>
            </div>
        </div>

        <!-- Image Upload -->
        <div class="row mb-3">
            <label for="image" class="col-sm-2 col-form-label">Image</label>
            <div class="col-sm-10">
                <input id="image" type="file" class="form-control" @change="handleFileUpload" required/>
                <div v-if="imageError" class="text-danger">Image is required</div>
            </div>
        </div>

        <!-- Date and Time -->
        <div class="row mb-3">
            <label for="date" class="col-sm-2 col-form-label">Date</label>
            <div class="col-sm-4">
                <input id="date" v-model="eventDate" type="date" class="form-control" required/>
                <div v-if="dateError" class="text-danger">Date is required</div>
            </div>

            <label for="time" class="col-sm-2 col-form-label">Time</label>
            <div class="col-sm-4">
                <input id="time" v-model="eventTime" type="time" class="form-control" required/>
                <div v-if="timeError" class="text-danger">Time is required</div>
            </div>
        </div>

        <!-- Location -->
        <div class="row mb-3">
            <label for="location" class="col-sm-2 col-form-label">Location</label>
            <div class="col-sm-10">
                <input id="location" v-model="eventLocation" type="text" class="form-control" required/>
                <div v-if="locationError" class="text-danger">Location is required</div>
            </div>
        </div>

        <div id="submitButton">
            <button type="submit" class="btn btn-warning mt-3" :disabled="isFormInvalid"> Submit </button>
        </div>
    </form>
</template>
    
<script>
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase/initialize'
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"; 

export default {
    mounted() {
        this.getUser();     
    },

    data() {
        return {
            currentUser: "",
            eventTitle: "",
            eventDescription: "",
            eventDate: null,
            eventTime: null,
            eventLocation: "",
            createdBy: "user001",
            file: "",
            imageURL: "",
            eventCategory: "",

            /* Errors */
            titleError: false,
            categoryError: false,
            descError: false,
            dateError: false,
            timeError: false,
            locationError: false,
        }
    },

    computed: {
        isFormInvalid() {
            return this.titleError || this.categoryError || this.descError || this.locationError || this.dateError || this.timeError;

        }
    },

    methods: {
        async getUser(){
            const sessionUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
            console.log(sessionUser.uid);
            this.currentUser = sessionUser.uid
        },

        validateForm() {
            this.titleError = !this.eventTitle || this.eventTitle.length > 15;
            this.descError = !this.eventDescription;
            this.categoryErrorError = !this.eventCategory;
            this.dateError = !this.eventDate
            this.timeError = !this.eventTime;
            this.locationError = !this.eventLocation;
        },

        async submitInput(e) {
        this.validateForm();

        if (this.isFormInvalid) {
            return; // Don't submit if the form is invalid
        }

        await this.uploadImage();

        console.log("Image URL after upload:", this.imageURL);

        console.log(this.imageURL)
        console.log(e.value);
        const dateTimeString = `${this.eventDate}T${this.eventTime}`;
        const combinedDateTime = new Date(dateTimeString);

        const docData = {
            name: this.eventTitle,
            description: this.eventDescription,
            date: Timestamp.fromDate(new Date(combinedDateTime)),
            location: this.eventLocation,
            imageURL: this.imageURL,
            createdBy: this.currentUser,
            category: this.eventCategory,
            joined: [],
            hours: Math.floor(Math.random() * 10) + 1,
            }

            // Add a new document in collection "events"
            const docRef = await addDoc(collection(db, "events"), docData);
            console.log("Document written with ID: ", docRef.id);
            this.eventID = docRef.id;
            this.$router.push({ name: 'eventDetail', params: { id: this.eventID } });
            console.log(this.eventID)
        },

        handleFileUpload(event) {
            this.file = event.target.files[0];
        },

        async uploadImage() {
            const storage = getStorage();
            const imageFile = this.file;

            if (imageFile) {
                const storageRef = ref(storage, `eventImages/${imageFile.name}`);
                const metadata = {
                    name: `${this.eventTitle} Image`,
                    contentType: imageFile.type,
                };

                return new Promise((resolve, reject) => {
                    const uploadTask = uploadBytesResumable(storageRef, imageFile, metadata);

                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                        },
                        (error) => {
                            console.error("Upload unsuccessful:", error);
                            reject(error);
                        },
                        async () => {
                            try {
                                this.imageURL = await getDownloadURL(uploadTask.snapshot.ref);
                                console.log('File available at', this.imageURL);
                                resolve(this.imageURL);
                            } catch (error) {
                                reject(error);
                            }
                        }
                    );
                });
            } else {
                console.log("No file selected.");
                return Promise.resolve(null); // No file to upload
            }
        },
    }
}
</script>

<style scoped>
@import '../css/events.css';


</style>

    