import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAphHvzhr7JIxIwtD_Ky2MoBS2TM9xkpuw",
    authDomain: "e-controlle.firebaseapp.com",
    projectId: "e-controlle",
    storageBucket: "e-controlle.appspot.com",
    messagingSenderId: "864771994802",
    appId: "1:864771994802:web:3f9c524ae2eb084046c5ab",
    databaseURL: "https://e-controlle-default-rtdb.firebaseio.com",
  };

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
export const db = getFirestore(app);
export const auth = getAuth(app);