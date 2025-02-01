import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  updateDoc,
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

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", async () => {
  const patientTable = document.getElementById("patient-list-table");

  if (!patientTable) {
    console.error("Error: Table element not found!");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role !== "psychologist") {
          alert("Access denied! Only psychologists can view this page.");
          window.location.href = "index.html";
        } else {
          fetchPatients();
        }
      } else {
        console.error("User data not found!");
        window.location.href = "index.html";
      }
    } else {
      window.location.href = "signin.html";
    }
  });
});

// Fetch patients who booked this psychologist
const fetchPatients = async () => {
  const patientTable = document.getElementById("patient-list-table");
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to view patients.");
    window.location = "signin.html";
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) return;

    const psychologistData = userDoc.data();
    const psychologistName = psychologistData.displayName;

    const appointmentQuery = query(
      collection(db, "appointments"),
      where("psychologist", "==", psychologistName)
    );

    const appointmentSnapshot = await getDocs(appointmentQuery);

    if (appointmentSnapshot.empty) {
      patientTable.innerHTML = `<tr><td colspan="5" class="text-center">No patients have booked you yet.</td></tr>`;
      return;
    }

    patientTable.innerHTML = ""; // Clear previous content

    for (const docSnap of appointmentSnapshot.docs) {
      const appointmentData = docSnap.data();
      const patientEmail = appointmentData.email;

      const patientQuery = query(
        collection(db, "users"),
        where("email", "==", patientEmail)
      );

      const patientSnapshot = await getDocs(patientQuery);

      patientSnapshot.forEach((patientDoc) => {
        const data = patientDoc.data();

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.displayName}</td>
          <td>${data.disabilityType || "None"}</td>
          <td>${appointmentData.dateTime}</td>
          <td>${appointmentData.appointmentType}</td>
          <td><button class="btn btn-primary join-btn" data-email="${
            data.email
          }">Start Meeting</button></td>
        `;
        patientTable.appendChild(row);
      });
    }

    // Add event listeners for Join buttons
    document.querySelectorAll(".join-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const patientEmail = event.target.getAttribute("data-email");
        await joinSession(patientEmail);
        window.location.href = "index4.html";
      });
    });
  } catch (error) {
    console.error("Error fetching patients: ", error);
    alert("Failed to load patients. Please try again.");
  }
};

// Mark session as active for the patient
const joinSession = async (patientEmail) => {
  const userQuery = query(
    collection(db, "users"),
    where("email", "==", patientEmail)
  );

  const userSnapshot = await getDocs(userQuery);
  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    const userRef = userDoc.ref;

    try {
      await updateDoc(userRef, {
        sessionTrue: true,
      });
      alert("Session marked as active for the patient!");
    } catch (error) {
      console.error("Error updating session status: ", error);
      alert("Failed to update session status. Please try again.");
    }
  } else {
    alert("Patient not found.");
  }
};

// Logout function
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "signin.html";
    })
    .catch((error) => {
      console.error("Logout failed: ", error);
      alert("Error logging out. Please try again.");
    });
});

// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDoc,
//   getDocs,
//   doc,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
// import {
//   getAuth,
//   onAuthStateChanged,
//   signOut,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
// const db = getFirestore(app);
// const auth = getAuth(app);

// // 🚀 **Check if user is authenticated & has psychologist role**
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     const userDoc = await getDoc(doc(db, "users", user.uid));
//     if (userDoc.exists()) {
//       const userData = userDoc.data();
//       console.log("User data:", userData);

//       if (userData.role !== "psychologist") {
//         alert("Access denied! Only psychologists can view this page.");
//         window.location.href = "index.html"; // Redirect unauthorized users
//       } else {
//         fetchPatients();
//       }
//     } else {
//       console.error("User data not found!");
//       window.location.href = "index.html"; // Redirect if user not found
//     }
//   } else {
//     window.location.href = "signin.html"; // Redirect if not logged in
//   }
// });

// // ✅ Fetching only booked patients for the psychologist
// const fetchPatients = async () => {
//   const patientTable = document.getElementById("patient-list-table");
//   const user = auth.currentUser;

//   if (!user) {
//     alert("You must be logged in to view patients.");
//     window.location = "signin.html";
//     return;
//   }

//   try {
//     const userDoc = await getDoc(doc(db, "users", user.uid));
//     if (!userDoc.exists()) {
//       console.error("User data not found!");
//       return;
//     }

//     const psychologistData = userDoc.data();
//     const psychologistName = psychologistData.displayName;

//     const appointmentQuery = query(
//       collection(db, "appointments"),
//       where("psychologist", "==", psychologistName)
//     );

//     const appointmentSnapshot = await getDocs(appointmentQuery);

//     if (appointmentSnapshot.empty) {
//       patientTable.innerHTML = `<tr><td colspan="3" class="text-center">No patients have booked you yet.</td></tr>`;
//       return;
//     }

//     const patientEmails = new Set();
//     appointmentSnapshot.forEach((doc) => {
//       patientEmails.add(doc.data().email);
//     });

//     patientTable.innerHTML = "";
//     for (const email of patientEmails) {
//       const patientQuery = query(
//         collection(db, "users"),
//         where("email", "==", email)
//       );
//       const patientSnapshot = await getDocs(patientQuery);

//       patientSnapshot.forEach((doc) => {
//         const data = doc.data();
//         const row = document.createElement("tr");
//         row.innerHTML = `
//           <td>${data.displayName}</td>
//           <td>${data.disabilityType || "None"}</td>
//           <td>${data.dateTime}</td>
//           <td>${appointmentType}</td>
//           <td><button class="btn btn-success start-meeting-btn">Start Meeting</button></td>
//         `;
//         patientTable.appendChild(row);
//       });
//     }

//     document.querySelectorAll(".start-meeting-btn").forEach((button) => {
//       button.addEventListener("click", (event) => {
//         const patientEmail = event.target.getAttribute("data-email");
//         startMeeting(patientEmail);
//       });
//     });
//   } catch (error) {
//     console.error("Error fetching patients: ", error);
//     alert("Failed to load patients. Please try again.");
//   }
// };

// // ✅ Redirect to meeting page with patient email
// const startMeeting = (patientEmail) => {
//   window.location.href = "index4.html"; //?patient=${encodeURIComponent(
//   //   patientEmail
//   // )}`;
// };
