import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { useUserStore } from "../store/user";

// ✅ Google config
GoogleSignin.configure({
  webClientId: "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com",
});

const Login = ({ navigation }) => {
  const { setUser, setLocalUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const showToast = (msg) => {
    ToastAndroid.showWithGravity(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  };

  // ================= EMAIL LOGIN =================
  const userLogIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(res.user);
      setLocalUser(res.user);
      showToast("Login successful");
    } catch {
      showToast("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ================= GOOGLE LOGIN =================
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
      showToast("Google login successful");
    } catch {
      showToast("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent");
      setModalVisible(false);
    } catch {
      showToast("Failed to send reset email");
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
              Log In
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              autoCapitalize="none"
              className="bg-gray-300 rounded-lg px-4 py-2"
            />

            <View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="bg-gray-300 rounded-lg px-4 py-2 pr-12"
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="gray"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="flex-row justify-end items-center space-x-1"
            >
              <Text>Forgot Password</Text>
              {/* ✅ FIXED ICON */}
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#3b82f6"
              />
            </TouchableOpacity>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              onPress={userLogIn}
              disabled={loading || googleLoading}
              className="bg-blue-500 rounded-xl p-3 items-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  Log In
                </Text>
              )}
            </TouchableOpacity>

            <Text className="text-center">OR</Text>

            {/* GOOGLE LOGIN */}
            <TouchableOpacity
              onPress={onGoogleButtonPress}
              disabled={loading || googleLoading}
              className="border-2 border-blue-500 p-3 rounded-xl items-center"
            >
              {googleLoading ? (
                <ActivityIndicator />
              ) : (
                <Text className="font-semibold">
                  Continue with Google
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            className="flex-row justify-center items-center my-4"
          >
            <Text>Don't have an account? </Text>
            <Text className="text-blue-500">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* RESET PASSWORD MODAL */}
      <Modal isVisible={isModalVisible}>
        <View className="bg-white p-6 rounded-2xl">
          <Text className="text-lg font-bold mb-3">
            Reset Password
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            className="bg-gray-300 rounded-lg px-4 py-2 mb-4"
          />

          <TouchableOpacity
            onPress={resetPassword}
            className="bg-blue-500 p-3 rounded-xl"
          >
            <Text className="text-white text-center">
              Send Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="mt-3"
          >
            <Text className="text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Login;
