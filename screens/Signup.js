import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Platform,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Keyboard
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { useUserStore } from "../store/user";

const { width, height } = Dimensions.get("window");

const Signup = ({ navigation }) => {
  const { setUser, setLocalUser } = useUserStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if(process.env.EXPO_PUBLIC_WEB_CLIENT_ID){
          GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
          });
      }
    } catch (e) {
      console.log("Google Config Error");
    }
  }, []);

  const showToast = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    } else {
      Alert.alert("Start Smart", msg);
    }
  };

  const userSignUp = async () => {
    Keyboard.dismiss();
    if (!email || !password || !name) {
      showToast("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await updateProfile(user, { displayName: name });

      try {
        await axios.post("https://start-smart-backend.vercel.app/api/users", {
          email: user.email,
          name: name,
        });
      } catch (backendError) {
        console.log("Backend sync failed", backendError);
      }

      const userData = { ...user, displayName: name, email: user.email };
      setUser(userData);
      setLocalUser(userData);
      showToast("Account created successfully!");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") showToast("Email already in use");
      else if (error.code === "auth/weak-password") showToast("Password should be at least 6 characters");
      else showToast("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      setGoogleLoading(true);
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      const idToken = data?.idToken;
      if (!idToken) throw new Error("No ID Token");

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, googleCredential);
      const user = result.user;

      try {
        const existingUser = await axios.get(`https://start-smart-backend.vercel.app/api/get-user?email=${user.email}`);
        if (!existingUser?.data) {
          await axios.post("https://start-smart-backend.vercel.app/api/users", {
            email: user.email,
            name: user.displayName || "Google User",
          });
        }
      } catch (err) { console.log("Backend Sync Skipped"); }

      setUser(user);
      setLocalUser(user);
      showToast("Google signup successful");
    } catch (error) {
      if (error.code !== -5) showToast("Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

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

             <View style={styles.headerContent}>
                 <Image 
                   source={require("../assets/loginHeader.png")} 
                   style={styles.headerImage} 
                   resizeMode="contain" 
                 />
                 <Text style={styles.headerTitle}>Create Account</Text>
                 <Text style={styles.headerSubtitle}>Join us and start learning smarter</Text>
             </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1, zIndex: 10 }}
      >
        <ScrollView 
            contentContainerStyle={styles.scrollContainer} 
            showsVerticalScrollIndicator={false} 
            keyboardShouldPersistTaps="handled"
        >         
          
          <Animated.View 
            style={[
              styles.floatingCard, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }] 
              }
            ]}
          >          
            
            <Text style={styles.label}>Full Name</Text>
            <View style={[
                styles.inputContainer, 
                nameFocused && styles.inputFocused
            ]}>
                <Ionicons name="person-outline" size={20} color={nameFocused ? "#2563eb" : "#94a3b8"} style={styles.inputIcon} />
                <TextInput
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    placeholder="John Doe"
                    autoCapitalize="words"
                    style={styles.input}
                    placeholderTextColor="#cbd5e1"
                />
            </View>

            <Text style={styles.label}>Email Address</Text>
            <View style={[
                styles.inputContainer, 
                emailFocused && styles.inputFocused
            ]}>
                <Ionicons name="mail-outline" size={20} color={emailFocused ? "#2563eb" : "#94a3b8"} style={styles.inputIcon} />
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    placeholderTextColor="#cbd5e1"
                />
            </View>            

            <Text style={styles.label}>Password</Text>
            <View style={[
                styles.inputContainer, 
                passFocused && styles.inputFocused
            ]}>
                <Ionicons name="lock-closed-outline" size={20} color={passFocused ? "#2563eb" : "#94a3b8"} style={styles.inputIcon} />
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPassFocused(true)}
                    onBlur={() => setPassFocused(false)}
                    placeholder="Create a password"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    placeholderTextColor="#cbd5e1"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 5 }}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={userSignUp} disabled={loading} activeOpacity={0.8} style={styles.shadowBtn}>
              <LinearGradient colors={["#2563eb", "#1d4ed8"]} style={styles.signupBtn} start={{x:0, y:0}} end={{x:1, y:0}}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupBtnText}>Sign Up</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
                onPress={onGoogleButtonPress} 
                disabled={loading || googleLoading} 
                style={styles.googleBtn}
                activeOpacity={0.7}
            >
                {googleLoading ? (
                    <ActivityIndicator color="#3b82f6" />
                ) : (
                    <View style={styles.googleBtnContent}>
                        <Image 
                            source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} 
                            style={{ width: 22, height: 22 }} 
                            resizeMode="contain"
                        />
                        <Text style={styles.googleBtnText}>Sign up with Google</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
            </View>

          </Animated.View>
          
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: "#f8fafc" 
  },
  headerContainer: {
    height: height * 0.20, 
    width: '100%',
  },
  gradientHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingTop: 10, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    position: 'relative',
    overflow: 'hidden'
  },
  circle1: { position: 'absolute', top: -60, left: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.1)' },
  circle2: { position: 'absolute', bottom: -20, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.1)' },

  headerContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  headerImage: {
    width: 140, 
    height: 45,
    marginBottom: 8,
    tintColor: 'white' 
  },
  headerTitle: {
    color: 'white',
    fontSize: 24, 
    fontWeight: '800',
    letterSpacing: 0.5
  },
  headerSubtitle: {
    color: '#e0e7ff', 
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.9
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 5
  },
  floatingCard: {
    width: width * 0.9, 
    backgroundColor: 'white',
    marginTop: 3, 
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10, 
  },
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#f8fafc", 
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 14, 
    paddingHorizontal: 16, 
    height: 50, 
    marginBottom: 15
  },
  inputFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff"
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: "#1e293b", fontWeight: "500" },
  
  shadowBtn: {
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 5
  },
  signupBtn: { 
    paddingVertical: 15, 
    borderRadius: 14, 
    alignItems: "center",
  },
  signupBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "bold", letterSpacing: 0.5 },

  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
  dividerText: { marginHorizontal: 12, color: "#94a3b8", fontSize: 13, fontWeight: "500" },

  googleBtn: { 
    backgroundColor: "#ffffff", 
    borderWidth: 1, 
    borderColor: "#cbd5e1", 
    borderRadius: 14, 
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  googleBtnContent: {
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  googleBtnText: { fontSize: 15, fontWeight: "600", color: "#334155", marginLeft: 12 },

  footerContainer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#64748b", fontSize: 14, fontWeight: "500" },
  loginText: { color: "#2563eb", fontWeight: "bold", fontSize: 14 },
});

export default Signup;