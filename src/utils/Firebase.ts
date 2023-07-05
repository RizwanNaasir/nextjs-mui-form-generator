// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIzbHWq9HKtE3_PAQqpafE8CuwKIR6Y8k",
    authDomain: "mui-form-generator.firebaseapp.com",
    projectId: "mui-form-generator",
    storageBucket: "mui-form-generator.appspot.com",
    messagingSenderId: "587456041237",
    appId: "1:587456041237:web:6ac554c34e2bf8f683191c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)
export const user = auth.currentUser;
