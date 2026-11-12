// Firebase Web SDK Integration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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
  // Delete an employee from Cloud Firestore (stores in recycle bin so they can be restored)
  async deleteEmployee(employee) {
    if (!db) return false;
    const empId = typeof employee === 'string' ? employee : employee.id;
    const empData = typeof employee === 'object' ? employee : { id: empId };
    try {
      const empRef = doc(db, "employees", empId);
      await deleteDoc(empRef);
      // Track full data in deleted_employees collection so other devices filter it out & can restore anytime
      const delRef = doc(db, "deleted_employees", empId);
      await setDoc(delRef, { ...empData, id: empId, deletedAt: new Date().toISOString() }, { merge: true });
      console.log("✓ Moved employee to recycle bin in Firebase Firestore:", empId);
      return true;
    } catch (err) {
      console.warn("Firebase deleteEmployee notice:", err.message);
      return false;
    }
  },
  // Restore a deleted employee from Cloud Firestore
  async restoreEmployee(employeeId) {
    if (!db) return false;
    try {
      const delRef = doc(db, "deleted_employees", employeeId);
      const snap = await getDoc(delRef);
      if (snap.exists()) {
        const empData = snap.data();
        delete empData.deletedAt;
        const empRef = doc(db, "employees", employeeId);
        await setDoc(empRef, empData, { merge: true });
      }
      await deleteDoc(delRef);
      console.log("✓ Restored employee from Firebase Firestore:", employeeId);
      return true;
    } catch (err) {
      console.warn("Firebase restoreEmployee notice:", err.message);
      return false;
    }
  },
  // Get full list of deleted employees for Recycle Bin
  async getDeletedEmployees() {
    if (!db) return [];
    try {
      const colRef = collection(db, "deleted_employees");
      const snap = await getDocs(colRef);
      const list = [];
      snap.forEach(d => list.push(d.data()));
      return list;
    } catch (e) {
      return [];
    }
  },
  // Get list of deleted employee IDs from Firestore
  async getDeletedEmployeeIds() {
    if (!db) return [];
    try {
      const colRef = collection(db, "deleted_employees");
      const snap = await getDocs(colRef);
      const list = [];
      snap.forEach(d => list.push(d.id));
      return list;
    } catch (e) {
      return [];
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

// Auto-sync any existing local employees to Cloud Firestore
try {
  const localRaw = localStorage.getItem('velolog_custom_employees');
  if (localRaw) {
    const localList = JSON.parse(localRaw);
    if (Array.isArray(localList) && localList.length > 0) {
      localList.forEach(emp => {
        window.VelologFirebase.saveEmployee(emp);
      });
    }
  }
} catch (e) {}

// Notify other scripts that Firebase is initialized and ready
window.dispatchEvent(new CustomEvent('velolog-firebase-ready', { detail: window.VelologFirebase }));



