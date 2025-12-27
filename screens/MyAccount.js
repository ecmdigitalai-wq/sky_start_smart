import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons"; 
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LinearGradient } from "expo-linear-gradient";

import { auth } from "../firebaseConfig";
import {
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useUserStore } from "../store/user";

const { width, height } = Dimensions.get("window");

const MyAccount = ({ navigation }) => {
  const { user, setUser, clearLocalUser } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nameChanged, setNameChanged] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);  

  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);

  const showToast = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      Alert.alert("Start Smart", msg);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      if (user?.providerData?.[0]?.providerId === "google.com") {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        } catch (e) { console.log(e); }
      }
      await signOut(auth);
      setUser(null);
      clearLocalUser();
      showToast("Signed out successfully");
    } catch (error) {
      showToast("Error while signing out");
    } finally {
      setLoading(false);
    }
  };
  
  const getUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("user");
      const localUser = userJSON ? JSON.parse(userJSON) : null;

      if (!localUser) { setLoading(false); return; }

      setUser(localUser);
      setName(localUser.displayName || "");
      setEmail(localUser.email || "");

      try {
        const response = await axios.get(
            `https://start-smart-backend.vercel.app/api/get-user?email=${localUser.email}`
        );
        if (response?.data) {
            setPhone(response.data.phone || "");
            setUser({ ...localUser, _id: response.data._id, phone: response.data.phone });
        }
      } catch (e) { console.log("Offline mode"); }
      
    } catch (error) { showToast("Error data fetch"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { getUser(); }, []);

  useEffect(() => { setNameChanged(user?.displayName !== name); }, [name, user]);
  useEffect(() => { setPhoneChanged(user?.phone !== phone); }, [phone, user]);

  const saveName = async () => {
    if (!name.trim()) return showToast("Enter valid name");
    try {
      setLoading(true);
      if(auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        setUser({ ...user, displayName: name });
        showToast("Name updated");
      }
    } catch { showToast("Update failed"); } 
    finally { setLoading(false); }
  };

  const savePhone = async () => {
    if (!phone || phone.length !== 10) return showToast("Phone must be 10 digits");
    try {
      setLoading(true);
      const res = await axios.put("https://start-smart-backend.vercel.app/api/users", {
        _id: user?._id, name, phone,
      });
      if (res.status === 200) {
        setUser({ ...user, phone });
        showToast("Phone updated");
      }
    } catch { showToast("Update failed"); } 
    finally { setLoading(false); }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Email sent");
    } catch { showToast("Failed to send"); }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.headerContainer}>
        <LinearGradient
            colors={["#2563eb", "#1e40af"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
        >
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            
            <View style={styles.headerTopRow}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate("AboutUs")}
                    style={styles.infoBtn}
                >
                    <Ionicons name="information-circle-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {name ? name.charAt(0).toUpperCase() : "U"}
                    </Text>
                </View>
                <Text style={styles.userName}>{name || "User"}</Text>
                <Text style={styles.userEmail}>{email}</Text>
            </View>
        </LinearGradient>
      </View>

      <View style={styles.scrollWrapper}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.cardContainer}>
              <Text style={styles.sectionTitle}>Personal Details</Text>

              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputWrapper, nameFocused && styles.inputFocused]}>
                <Ionicons name="person-outline" size={20} color={nameFocused ? "#2563eb" : "#94a3b8"} />
                <TextInput
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    style={styles.input}
                    placeholder="Enter your name"
                />
                {nameChanged && (
                    <TouchableOpacity onPress={saveName} style={styles.saveIcon}>
                        <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
                    </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, styles.readOnlyInput]}>
                <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                <TextInput
                    value={email}
                    editable={false}
                    style={[styles.input, { color: "#64748b" }]}
                />
                <Ionicons name="lock-closed-outline" size={18} color="#cbd5e1" />
              </View>

              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.inputWrapper, phoneFocused && styles.inputFocused]}>
                <Ionicons name="call-outline" size={20} color={phoneFocused ? "#2563eb" : "#94a3b8"} />
                <TextInput
                    value={String(phone)}
                    onChangeText={setPhone}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                    keyboardType="phone-pad"
                    maxLength={10}
                    style={styles.input}
                    placeholder="Add phone number"
                />
                {phoneChanged && (
                    <TouchableOpacity onPress={savePhone} style={styles.saveIcon}>
                        <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
                    </TouchableOpacity>
                )}
              </View>

              {user?.providerData?.[0]?.providerId !== "google.com" && (
                  <TouchableOpacity onPress={resetPassword} style={styles.passwordRow}>
                    <View style={styles.passwordIconBox}>
                        <Ionicons name="key-outline" size={20} color="#2563eb" />
                    </View>
                    <Text style={styles.passwordText}>Change Password</Text>
                    <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                  </TouchableOpacity>
              )}
          </View>

          <TouchableOpacity onPress={handleSignOut} style={styles.logoutBtn} activeOpacity={0.8}>
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <View style={{height: 50}} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#f8fafc" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" },
  
  headerContainer: { 
    height: height * 0.28, 
    width: width,
    zIndex: 1
  },
  gradientHeader: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden'
  },
  circle1: { position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
  circle2: { position: 'absolute', bottom: -20, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },

  headerTopRow: { flexDirection: 'row', width: '90%', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: 'white' },
  infoBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },

  profileSection: { alignItems: 'center', marginTop: 5 },
  avatarContainer: { 
    width: 60, height: 60, 
    borderRadius: 30, backgroundColor: 'white', 
    justifyContent: 'center', alignItems: 'center', 
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 6,
    shadowColor: "#000", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5
  },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  userName: { fontSize: 16, fontWeight: 'bold', color: 'white' },
  userEmail: { fontSize: 12, color: '#dbeafe', marginTop: 1 },

  scrollWrapper: {
    flex: 1,
    marginTop: 5, 
    zIndex: 2,
    backgroundColor: 'transparent'
  },
  scrollContent: { 
    alignItems: 'center',
    paddingBottom: 20
  },

  cardContainer: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: "#1e293b", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 20 },
  
  label: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20
  },
  inputFocused: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  readOnlyInput: { backgroundColor: '#f1f5f9', borderColor: 'transparent' },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#334155', fontWeight: '500' },
  saveIcon: { padding: 4 },

  passwordRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 10,
    marginTop: 5
  },
  passwordIconBox: { backgroundColor: '#eff6ff', padding: 8, borderRadius: 10, marginRight: 12 },
  passwordText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#334155' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1, borderColor: '#fee2e2',
    borderRadius: 16,
    width: width * 0.9,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 20
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#ef4444', marginLeft: 8 },
});

export default MyAccount;