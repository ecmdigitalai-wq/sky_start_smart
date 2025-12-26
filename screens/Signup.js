import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Svg, { Path } from "react-native-svg";
import axios from "axios";

import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useUserStore } from "../store/user";

// ⚠️ Google config (same as Login.js)
GoogleSignin.configure({
  webClientId:
    "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com",
});

const Signup = ({ navigation }) => {
  const { setLocalUser, setUser } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const showToast = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  // ================= EMAIL SIGNUP =================
  const signUpUser = async () => {
    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(res.user, {
        displayName: name,
      });

      const user = res.user;

      // backend save
      const existingUser = await axios.get(
        `https://start-smart-backend.vercel.app/api/get-user?email=${user.email}`
      );

      if (!existingUser?.data) {
        await axios.post(
          "https://start-smart-backend.vercel.app/api/users",
          {
            email: user.email,
            name: user.displayName,
          }
        );
      }

      setUser(user);
      setLocalUser(user);
      showToast("Account created successfully");
    } catch (err) {
      setUser(null);
      showToast("Signup failed. Try again");
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE SIGNUP =================
  const onGoogleButtonPress = async () => {
    try {
      setGoogleLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { idToken } = await GoogleSignin.signIn();

      const googleCredential =
        GoogleAuthProvider.credential(idToken);

      const result = await signInWithCredential(
        auth,
        googleCredential
      );

      const user = result.user;

      const existingUser = await axios.get(
        `https://start-smart-backend.vercel.app/api/get-user?email=${user.email}`
      );

      if (!existingUser?.data) {
        await axios.post(
          "https://start-smart-backend.vercel.app/api/users",
          {
            email: user.email,
            name: user.displayName,
          }
        );
      }

      setUser(user);
      setLocalUser(user);
      showToast("Google signup successful");
    } catch (err) {
      setUser(null);
      showToast("Google signup failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-screen justify-between">
          <Image
            source={require("../assets/loginHeader.png")}
            className="w-[70%] h-24 my-4 mx-auto"
            resizeMode="contain"
          />

          <View className="w-[85%] mx-auto space-y-5">
            <Text className="text-blue-500 text-3xl font-bold">
              Sign Up
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              className="bg-gray-300 rounded-lg px-4 py-2"
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              className="bg-gray-300 rounded-lg px-4 py-2"
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              className="bg-gray-300 rounded-lg px-4 py-2"
            />

            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              secureTextEntry
              autoCapitalize="none"
              className="bg-gray-300 rounded-lg px-4 py-2"
            />

            {/* SIGNUP BUTTON */}
            <TouchableOpacity
              disabled={loading || googleLoading}
              onPress={() => {
                if (
                  !name ||
                  !email ||
                  !password ||
                  !confirmPassword
                ) {
                  showToast("All fields are required");
                  return;
                }

                if (password.length < 8) {
                  showToast(
                    "Password must be at least 8 characters"
                  );
                  return;
                }

                if (password !== confirmPassword) {
                  showToast("Passwords do not match");
                  return;
                }

                signUpUser();
              }}
              className="bg-blue-500 p-3 rounded-xl items-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>

            <Text className="text-center">OR</Text>

            {/* GOOGLE SIGNUP */}
            <TouchableOpacity
              disabled={loading || googleLoading}
              onPress={onGoogleButtonPress}
              className="border-2 border-blue-500 p-3 rounded-xl flex-row items-center"
            >
              {googleLoading ? (
                <ActivityIndicator />
              ) : (
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={25}
                  height={25}
                  viewBox="0 0 48 48"
                >
                  <Path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></Path>
                  <Path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></Path>
                  <Path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></Path>
                  <Path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></Path>
                </Svg>
              )}
              <Text className="flex-1 text-center font-semibold">
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="flex-row justify-center items-center my-4"
          >
            <Text>Already have an account? </Text>
            <Text className="text-blue-500">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
