// Firebase Web SDK Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDEGSq903CUu_ElJTAVpK0q_gfcwO1gt8Y",
  authDomain: "velolog-signature-studio.firebaseapp.com",
  projectId: "velolog-signature-studio",
  storageBucket: "velolog-signature-studio.firebasestorage.app",
  messagingSenderId: "557290980383",
  appId: "1:557290980383:web:4eb8256931fe4c7d80812a",
  measurementId: "G-9RLS97XM53"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export let analytics = null;
export let db = null;

try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics is skipped in local file:// protocols or if offline
}

try {
  db = getFirestore(app);
} catch (e) {
  console.warn("Firestore init skipped:", e);
}

// Global Firebase Helper Object for VELOLOG across Studio & Team
window.VelologFirebase = {
  app,
  db,
  isReady: Boolean(db),
  // Save an employee to Cloud Firestore
  async saveEmployee(employee) {
    if (!db) return false;
    try {
      const empRef = doc(db, "employees", employee.id);
      await setDoc(empRef, employee, { merge: true });
      console.log("✓ Saved employee to Firebase Firestore:", employee.id);
      return true;
    } catch (err) {
      console.warn("Firebase saveEmployee notice:", err.message);
      return false;
    }
  },
  // Fetch employees from Cloud Firestore
  async getEmployees() {
    if (!db) return [];
    try {
      const colRef = collection(db, "employees");
      const snap = await getDocs(colRef);
      const list = [];
      snap.forEach(d => list.push(d.data()));
      console.log(`✓ Fetched ${list.length} custom employees from Firebase Firestore`);
      return list;
    } catch (err) {
      console.warn("Firebase getEmployees notice:", err.message);
      return [];
    }
  }
};

// Notify other scripts that Firebase is initialized and ready
window.dispatchEvent(new CustomEvent('velolog-firebase-ready', { detail: window.VelologFirebase }));



