// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
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
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Get the user role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data:", userData);

      if (userData.role !== "patient") {
        window.location.href = "index.html"; // Redirect unauthorized users
      } else {
        document.getElementById("body").style.display = "block";
      }
    } else {
      console.error("User data not found!");
      window.location.href = "index.html"; // Redirect if user not found
    }
  } else {
    window.location.href = "signin.html"; // Redirect if not logged in
  }
});

// Populate psychologists dropdown
const populatePsychologists = async () => {
  const psychologistDropdown = document.getElementById("psychologist");

  try {
    // Query Firestore for users with role "psychologist"
    const q = query(
      collection(db, "users"),
      where("role", "==", "psychologist")
    );
    const querySnapshot = await getDocs(q);

    // Add psychologists as options in the dropdown
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const option = document.createElement("option");
      option.value = data.displayName; // You can change this to `doc.id` if needed
      option.textContent = data.displayName;
      psychologistDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching psychologists: ", error);
    alert("Failed to load psychologists. Please try again.");
  }
};

// Call the function to populate psychologists
populatePsychologists();

// Form submission
const appointmentForm = document.getElementById("appointment-form");

appointmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const psychologist = document.getElementById("psychologist").value;
  const dateTime = document.getElementById("dateTime").value;
  const appointmentType = document.querySelector(
    'input[name="appointmentType"]:checked'
  ).value;
  const message = document.getElementById("message").value;

  try {
    // Save appointment data to Firestore
    await addDoc(collection(db, "appointments"), {
      name,
      email,
      phone,
      psychologist,
      dateTime,
      appointmentType,
      message,
      createdAt: new Date().toISOString(),
    });
    alert("Appointment successfully booked!");
    appointmentForm.reset();
  } catch (error) {
    console.error("Error adding appointment: ", error);
    alert("Failed to book appointment. Please try again.");
  }
});
