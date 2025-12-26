import "expo-dev-client";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import Navigation from "./navigations/Navigation";
import AuthNavigation from "./navigations/AuthNavigation";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import { useUserStore } from "./store/user";

// Google Sign-In config
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

// Splash screen control
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { user, loading, getLocalUser } = useUserStore();

  useEffect(() => {
    const init = async () => {
      await SplashScreen.preventAutoHideAsync();

      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 2000);
    };

    init();

    // ✅ Firebase v9 correct listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getLocalUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#312651" />
      </View>
    );
  }

  return user ? <Navigation /> : <AuthNavigation />;
}
