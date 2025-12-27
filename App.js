import "./global.css"; 
import "expo-dev-client";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native"; // ✅ Import zaroori hai
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { onAuthStateChanged } from "firebase/auth";

import Navigation from "./navigations/Navigation";
import AuthNavigation from "./navigations/AuthNavigation";
import { auth } from "./firebaseConfig";
import { useUserStore } from "./store/user";

SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
});

export default function App() {
  const { user, loading, setLocalUser, setUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLocalUser(user);
      } else {
        setUser(null);
      }
      SplashScreen.hideAsync();
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* ✅ Container YAHAN hona chahiye, aur sirf yahan */}
      <NavigationContainer>
        {user ? <Navigation /> : <AuthNavigation />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}