// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
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
const db = getFirestore(app);

// Form submission
const contact = document.getElementById("apply-form");

contact.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const upload = document.getElementById("file").value;
  const message = document.getElementById("message").value;

  try {
    // Save appointment data to Firestore
    await addDoc(collection(db, "Application"), {
      name,
      email,
      phone,
      upload,
      message,
      createdAt: new Date().toISOString(),
    });
    alert("Form Submitted successfully!");
    contact.reset();
  } catch (error) {
    console.error("Error while submiting form: ", error);
    alert("Failed to Submit Form. Please try again.");
  }
});
