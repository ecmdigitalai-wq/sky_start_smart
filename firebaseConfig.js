import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHR9-e5K39oaH22w53ieuzdhTHzJIPPTc",
  authDomain: "startsmart-532ae.firebaseapp.com",
  projectId: "startsmart-532ae",
  storageBucket: "startsmart-532ae.firebasestorage.app",
  messagingSenderId: "580178347630",
  appId: "1:580178347630:web:479cdab6c355c4311ec87f"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Correct way for React Native / Expo
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
