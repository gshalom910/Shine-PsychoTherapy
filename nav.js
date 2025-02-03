// // Import Firebase modules
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
//   updateDoc,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9Wr5R8RkfpLb_P-8zKmOr83hPax7-YzE",
//   authDomain: "mental-health-c160c.firebaseapp.com",
//   projectId: "mental-health-c160c",
//   storageBucket: "mental-health-c160c.appspot.com",
//   messagingSenderId: "486273723773",
//   appId: "1:486273723773:web:8a2481f89607c382e4b014",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Select navigation links
// const loggedIn = document.querySelectorAll(".logged");
// const loggedOut = document.querySelectorAll(".loggedOut");
// const displayName = document.getElementById("displayName");
// const joinBtn = document.getElementById("join-btn");

// // Debugging: Ensure elements exist
// if (!displayName) {
//   console.warn("⚠️ displayName element not found! Check your HTML.");
// }

// // Check authentication on page load
// onAuthStateChanged(auth, async (user) => {
//   console.log("🔄 Checking auth state...");

//   if (user) {
//     console.log("✅ User is logged in:", user.email);
//     loggedIn.forEach((item) => (item.style.display = "block"));
//     loggedOut.forEach((item) => (item.style.display = "none"));

//     const userRef = doc(db, "users", user.uid);
//     const docSnapShot = await getDoc(userRef);

//     if (docSnapShot.exists()) {
//       const userData = docSnapShot.data();
//       displayName.textContent = "Hi, " + userData.displayName;

//       if (userData.role === "patient" && userData.sessionTrue) {
//         joinBtn.style.display = "block"; // Show Join Session button
//       } else if (
//         userData.role === "patient" &&
//         userData.sessionTrue === false
//       ) {
//         joinBtn.style.display = "none"; // Hide button
//       }
//     }
//   } else {
//     console.log("❌ No user logged in");
//     loggedIn.forEach((item) => (item.style.display = "none"));
//     loggedOut.forEach((item) => (item.style.display = "block"));
//   }
// });

// // Add event listener to the "Join Session" button
// if (joinBtn) {
//   joinBtn.addEventListener("click", async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       alert("You must be logged in to join a session.");
//       return;
//     }

//     const userRef = doc(db, "users", user.uid);

//     try {
//       await updateDoc(userRef, { sessionTrue: false });
//       alert("Session has started!");
//       joinBtn.style.display = "none"; // Hide button after joining
//       window.location.href = "index4.html"; // Redirect to session page
//     } catch (error) {
//       console.error("Error updating session status:", error);
//       alert("Failed to start the session. Please try again.");
//     }
//   });
// }

// // Handle logout
// document.getElementById("logout-btn").addEventListener("click", async () => {
//   try {
//     await signOut(auth);
//     alert("You have logged out successfully.");
//     window.location = "signin.html";
//   } catch (error) {
//     console.error("❌ Error logging out:", error);
//     alert("Error logging out. Please try again.");
//   }
// });

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
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
const auth = getAuth(app);
const db = getFirestore(app);

// Select navigation links
const loggedIn = document.querySelectorAll(".logged");
const loggedOut = document.querySelectorAll(".loggedOut");
const displayName = document.getElementById("displayName");
const joinBtn = document.getElementById("join-btn");

// Debugging: Ensure elements exist
if (!displayName) {
  console.warn("⚠️ displayName element not found! Check your HTML.");
}

// Check authentication on page load
onAuthStateChanged(auth, async (user) => {
  console.log("🔄 Checking auth state...");

  if (user) {
    console.log("✅ User is logged in:", user.email);
    loggedIn.forEach((item) => (item.style.display = "block"));
    loggedOut.forEach((item) => (item.style.display = "none"));

    const userRef = doc(db, "users", user.uid);
    const docSnapShot = await getDoc(userRef);

    if (docSnapShot.exists()) {
      const userData = docSnapShot.data();
      displayName.textContent = "Hi, " + userData.displayName;

      if (userData.role === "patient" && userData.sessionTrue) {
        joinBtn.style.display = "block"; // Show Join Session button
      } else {
        joinBtn.style.display = "none"; // Hide button
      }
    }
  } else {
    console.log("❌ No user logged in");
    loggedIn.forEach((item) => (item.style.display = "none"));
    loggedOut.forEach((item) => (item.style.display = "block"));
  }
});

// Add event listener to the "Join Session" button
if (joinBtn) {
  joinBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to join a session.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, { sessionTrue: false });
      alert("Session has started!");
      joinBtn.style.display = "none"; // Hide button after joining
      window.location.href = "index4.html"; // Redirect to session page
    } catch (error) {
      console.error("Error updating session status:", error);
      alert("Failed to start the session. Please try again.");
    }
  });
}

// Handle logout
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("You have logged out successfully.");
    window.location = "signin.html";
  } catch (error) {
    console.error("❌ Error logging out:", error);
    alert("Error logging out. Please try again.");
  }
});
