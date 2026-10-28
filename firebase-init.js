// Firebase Web SDK Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";

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

try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics is skipped in local file:// protocols or if offline
  console.info("Firebase initialized successfully.");
}
