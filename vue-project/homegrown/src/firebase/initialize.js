// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth'; // auth service
import { getStorage } from "firebase/storage"; // storage service

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoIazOnYVJEuRJ9ANjRXeYPoVYX7jbHk4",
  authDomain: "homegrown-52ddc.firebaseapp.com",
  projectId: "homegrown-52ddc",
  storageBucket: "homegrown-52ddc.appspot.com",
  messagingSenderId: "237220468485",
  appId: "1:237220468485:web:7c51d659c78e029a61096c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// init firestore service
const db = getFirestore(app)

// init auth service
const auth = getAuth(app);

// init storage service
const storage = getStorage(app);

export { auth, db, storage };