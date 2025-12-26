import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform, // ✅ Added for safety
  Alert,    // ✅ Added for iOS fallback
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { auth } from "../firebaseConfig";
import {
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useUserStore } from "../store/user";

const MyAccount = ({ navigation }) => {
  const { user, setUser, clearLocalUser } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nameChanged, setNameChanged] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);

  // ✅ SAFE TOAST FUNCTION (iOS Proof)
  const showToast = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } else {
      Alert.alert("Start Smart", msg);
    }
  };

  // ================= LOGOUT =================
  const handleSignOut = async () => {
    try {
      setLoading(true);

      // Check if user is signed in with Google
      const isGoogleUser = user?.providerData?.some(
        (provider) => provider.providerId === "google.com"
      );

      if (isGoogleUser) {
        try {
          await GoogleSignin.signOut();
          // Note: revokeAccess() is optional and sometimes causes errors if token is invalid, 
          // removing it makes logout safer. Add back only if strict requirement.
          // await GoogleSignin.revokeAccess(); 
        } catch (e) {
          console.log("Google SignOut Error (Ignored):", e);
        }
      }

      await signOut(auth);

      setUser(null);
      clearLocalUser();
      showToast("Signed out successfully");
      
      // Navigate to Auth stack if needed, though state change usually handles it
      // navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); 
    } catch (error) {
      console.error(error);
      showToast("Error while signing out");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD USER =================
  const getUser = async () => {
    try {
      setLoading(true);

      const userJSON = await AsyncStorage.getItem("user");
      const localUser = userJSON ? JSON.parse(userJSON) : null;

      if (!localUser) {
          setLoading(false);
          return;
      }

      setUser(localUser);
      setName(localUser.displayName || "");
      setEmail(localUser.email || "");

      // Optional chaining added to prevent crash if backend is down
      try {
          const response = await axios.get(
            `https://start-smart-backend.vercel.app/api/get-user?email=${localUser.email}`
          );
    
          if (response?.data) {
            setPhone(response.data.phone || "");
            setUser({
              ...localUser,
              _id: response.data._id,
              phone: response.data.phone,
            });
          }
      } catch (apiError) {
          console.log("Backend fetch failed, using local data only");
      }

    } catch (error) {
      showToast("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    // Optional chaining to prevent crash on null user
    setNameChanged(user?.displayName !== name);
  }, [name, user]);

  useEffect(() => {
    setPhoneChanged(user?.phone !== phone);
  }, [phone, user]);

  // ================= UPDATE NAME =================
  const saveName = async () => {
    if (!name.trim()) {
      showToast("Please enter a valid name");
      return;
    }

    try {
      setLoading(true);
      
      if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: name,
          });
          setUser({ ...user, displayName: name });
          showToast("Name updated successfully");
      } else {
          showToast("No user found");
      }
    } catch (error) {
      showToast("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE PHONE =================
  const savePhone = async () => {
    if (!phone || phone.length !== 10) {
      showToast("Phone must be 10 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        "https://start-smart-backend.vercel.app/api/users",
        {
          _id: user?._id,
          name, // Sending name is safer for some backends
          phone,
        }
      );

      if (response.status === 200) {
        setUser({ ...user, phone });
        showToast("Phone updated successfully");
      }
    } catch (error) {
      showToast("Error updating phone");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async () => {
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent");
    } catch (error) {
      showToast("Failed to send reset email");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#312651" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="m-5 space-y-5">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold">My Account</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("About Us")}
              className="flex-row items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full"
            >
              <Text className="text-blue-500 font-semibold">About</Text>
              <AntDesign
                name="exclamationcircleo"
                size={18}
                color="#3b82f6"
              />
            </TouchableOpacity>
          </View>

          <Image
            source={require("../assets/myaccount-bg.png")}
            className="w-full h-36"
            resizeMode="contain"
          />

          {/* NAME */}
          <View className="flex-row items-center space-x-3">
            <Text className="w-12 font-medium">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="flex-1 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200"
            />
            {nameChanged && (
              <TouchableOpacity onPress={saveName} className="bg-blue-100 p-2 rounded-full">
                <AntDesign name="upload" size={20} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          {/* EMAIL */}
          <View className="flex-row items-center space-x-3">
            <Text className="w-12 font-medium">Email</Text>
            <TextInput
              value={email}
              editable={false}
              className="flex-1 bg-gray-200 px-4 py-3 rounded-xl text-gray-500"
            />
          </View>

          {/* PHONE */}
          <View className="flex-row items-center space-x-3">
            <Text className="w-12 font-medium">Phone</Text>
            <TextInput
              value={String(phone)}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="Enter phone number"
              className="flex-1 bg-gray-100 px-4 py-3 rounded-xl border border-gray-200"
            />
            {phoneChanged && (
              <TouchableOpacity onPress={savePhone} className="bg-blue-100 p-2 rounded-full">
                <AntDesign name="upload" size={20} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          {/* RESET PASSWORD */}
          {user?.providerData?.[0]?.providerId !== "google.com" && (
            <TouchableOpacity
              onPress={resetPassword}
              className="flex-row justify-end items-center space-x-2 mt-2"
            >
              <Text className="text-blue-500 font-medium">Change Password</Text>
              <AntDesign
                name="arrowright"
                size={18}
                color="#3b82f6"
              />
            </TouchableOpacity>
          )}

          {/* LOGOUT */}
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 py-4 rounded-2xl flex-row justify-center items-center space-x-3 mt-10 shadow-sm"
          >
            <Ionicons name="power" size={24} color="white" />
            <Text className="text-white text-lg font-bold">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccount;