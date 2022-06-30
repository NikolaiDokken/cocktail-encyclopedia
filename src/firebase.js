import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB6YbQBtLeilE_YJBuuT0Z_L5YPkWaVem8",
    authDomain: "cock-dic.firebaseapp.com",
    projectId: "cock-dic",
    storageBucket: "cock-dic.appspot.com",
    messagingSenderId: "628694530218",
    appId: "1:628694530218:web:3b8d9b8dce2b4affc738d3",
};

// Init firebase app
initializeApp(firebaseConfig);

// Init firestore service
const auth = getAuth();
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithRedirect(auth, provider);

const firestore = getFirestore();
export { auth, firestore, signOut };
