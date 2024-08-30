
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, addDoc, getDocs,getDoc,onSnapshot,updateDoc,deleteDoc ,  } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAJgYJyPcYj1f3L14-BmMehvvSZhwbpSvM",
  authDomain: "ecommerce-cdf3e.firebaseapp.com",
  projectId: "ecommerce-cdf3e",
  storageBucket: "ecommerce-cdf3e.appspot.com",
  messagingSenderId: "97538029462",
  appId: "1:97538029462:web:0869c7ee37d0e322bc0fb7"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, firestore, storage, createUserWithEmailAndPassword, collection, doc, 
  setDoc, signInWithEmailAndPassword, uploadBytesResumable, getDownloadURL, ref, addDoc,getDocs,getDoc ,onSnapshot,
  updateDoc  ,deleteDoc };
