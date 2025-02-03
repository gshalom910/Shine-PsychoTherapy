import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
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

const roleSelect = document.getElementById("role");
const disabilityContainer = document.getElementById("disabilityContainer");
const submit = document.getElementById("signUp");

roleSelect.addEventListener("change", (event) => {
  if (event.target.value === "patient") {
    disabilityContainer.style.display = "block";
    document.getElementById("disability").setAttribute("required", "required");
  } else {
    disabilityContainer.style.display = "none";
    document.getElementById("disability").removeAttribute("required");
  }
});

submit.addEventListener("click", async function (event) {
  event.preventDefault();

  try {
    // Input fields
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const pwd = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const disabilityType = document.getElementById("disability").value;

    if (!email || !pwd || !userName || !role) {
      console.error("Required fields are missing!");
      alert("Please fill out all required fields.");
      return;
    }

    console.log("Attempting to create user...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pwd
    );
    const user = userCredential.user;
    console.log("User created successfully:", user);

    console.log("Attempting to save user data to Firestore...");
    const userDoc = {
      email: user.email,
      uid: user.uid,
      displayName: userName,
      role: role,
    };

    // Add fields only if the user is a patient
    if (role === "patient") {
      userDoc.disabilityType = disabilityType;
      userDoc.sessionTrue = false;
    }

    await setDoc(doc(db, "users", user.uid), userDoc);

    console.log("User data saved to Firestore successfully!");
    alert("User registered successfully!");
    if (role === "patient") {
      window.location = "index.html";
    } else if (role === "psychologist") {
      window.location = "index1.html";
    } else {
      console.error("Invalid role selected.");
      alert("Invalid role. Please try again.");
    }
  } catch (error) {
    console.error("Error occurred during signup:", error);
    alert("Please Try Again Using Valid Data");
  }
});
