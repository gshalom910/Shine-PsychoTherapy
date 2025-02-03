import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9Wr5R8RkfpLb_P-8zKmOr83hPax7-YzE",
  authDomain: "mental-health-c160c.firebaseapp.com",
  projectId: "mental-health-c160c",
  storageBucket: "mental-health-c160c.appspot.com",
  messagingSenderId: "486273723773",
  appId: "1:486273723773:web:8a2481f89607c382e4b014",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const submit = document.getElementById("signIn");

submit.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    const email = document.getElementById("email").value;
    const pwd = document.getElementById("password").value;

    if (!email || !pwd) {
      console.error("Required fields are missing!");
      alert("Please fill out all required fields.");
      return;
    }

    console.log("Attempting to log in user...");
    const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
    const user = userCredential.user;
    console.log("User logged in successfully:", user);

    console.log("Fetching user data from Firestore...");
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      console.error("No user data found in Firestore!");
      alert("User not found. Create account Please!");
      return;
    }

    const userData = userDoc.data();
    console.log("User data retrieved:", userData);

    // Save user data to localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: user.email,
        uid: user.uid,
        role: userData.role,
      })
    );
    console.log("User data saved to LocalStorage successfully!");

    //Redirect based on role
    if (userData.role === "patient") {
      window.location = "index.html";
    } else if (userData.role === "psychologist") {
      window.location = "index1.html";
    } else {
      console.error("Invalid role in Firestore.");
      alert("Invalid role. Please contact support.");
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    alert("Please Try Again Using Valid Data");
  }
});
