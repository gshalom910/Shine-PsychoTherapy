// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
const auth = getAuth(app);

// Get form element
const contact = document.getElementById("contact-form");
if (!contact) {
  console.error("Contact form element not found!");
}

// Check authentication on page load
onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Login First");
    window.location.href = "signin.html";
  }
});

// Handle form submission
contact?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Login First");
    window.location.href = "signin.html";
    return;
  }

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  try {
    await addDoc(collection(db, "Contact Us"), {
      // Renamed collection
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    });
    alert("Form Submitted successfully!");
    contact.reset();
  } catch (error) {
    console.error("Error while submitting form: ", error);
    alert("Failed to Submit Form. Please try again.");
  }
});
