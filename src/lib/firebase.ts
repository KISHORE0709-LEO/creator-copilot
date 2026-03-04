import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNElwfTavB4VrNK4UgJM_-BLpYmAga_RM",
  authDomain: "creator-copilot-5db3a.firebaseapp.com",
  projectId: "creator-copilot-5db3a",
  storageBucket: "creator-copilot-5db3a.firebasestorage.app",
  messagingSenderId: "1005216430699",
  appId: "1:1005216430699:web:1172e9ac1b906ee6cb0f2e",
  measurementId: "G-GTSLFQ48MB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const COLLECTIONS = {
  USERS: 'users',
  CONTENT: 'content',
  ANALYTICS: 'analytics',
  TRENDS: 'trends',
  MONETIZATION: 'monetization',
  CALENDAR: 'calendar',
  COPYRIGHT: 'copyright',
  CHAT_HISTORY: 'chatHistory'
} as const;
