import "./global.css"; 
import "expo-dev-client";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
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
  const { user, setLocalUser, setUser } = useUserStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLocalUser(user);
      } else {
        setUser(null);
      }
      setInitializing(false);
      SplashScreen.hideAsync();
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {user ? <Navigation /> : <AuthNavigation />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}