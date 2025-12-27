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
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient"; 
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useUserStore } from "../store/user";

// Get Screen Dimensions
const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const { setUser, setLocalUser } = useUserStore();

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Focus States for Inputs (UI Enhancement)
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  useEffect(() => {
    // Entrance Animation
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

    // Google Config
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

  const userLogIn = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      showToast("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      const userData = { ...res.user, email: res.user.email, displayName: res.user.displayName };
      setUser(userData);
      setLocalUser(userData);
      showToast("Login successful");
    } catch (error) {
      if (error.code === "auth/invalid-credential") showToast("Invalid email or password");
      else showToast("Login failed. Please try again.");
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
      
      setUser(user);
      setLocalUser(user);
      showToast("Google login successful");
    } catch (error) {
      if (error.code !== -5) showToast("Google sign-in failed"); // -5 is user cancelled
    } finally {
      setGoogleLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) return showToast("Please enter your email first");
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent");
      setModalVisible(false);
    } catch (error) {
      showToast("Failed to send reset email");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      {/* Background Header */}
      <View style={styles.headerContainer}>
        <LinearGradient
            colors={["#2563eb", "#1e40af"]} // Modern Deep Blue Gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
        >
             {/* Decorative Circles for modern look */}
             <View style={styles.circle1} />
             <View style={styles.circle2} />

             {/* Logo / Title Area */}
             <View style={styles.headerContent}>
                 <Image 
                   source={require("../assets/loginHeader.png")} 
                   style={styles.headerImage} 
                   resizeMode="contain" 
                 />
                 <Text style={styles.headerTitle}>Welcome Back</Text>
                 <Text style={styles.headerSubtitle}>Sign in to continue using Start Smart</Text>
             </View>
        </LinearGradient>
      </View>

      {/* Main Content Form */}
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
            
            {/* Email Input */}
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

            {/* Password Input */}
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
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    placeholderTextColor="#cbd5e1"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 5 }}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.forgotPassBtn}>
              <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity onPress={userLogIn} disabled={loading || googleLoading} activeOpacity={0.8} style={styles.shadowBtn}>
              <LinearGradient colors={["#2563eb", "#1d4ed8"]} style={styles.loginBtn} start={{x:0, y:0}} end={{x:1, y:0}}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Log In</Text>}
              </LinearGradient>
            </TouchableOpacity>

            {/* DIVIDER */}
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* GOOGLE LOGIN BUTTON */}
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
                        <Text style={styles.googleBtnText}>Sign in with Google</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* FOOTER */}
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>
            </View>

          </Animated.View>
          
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)} animationIn="fadeInUp" animationOut="fadeOutDown" backdropOpacity={0.4}>
        <View style={styles.modalContent}>
          <View style={styles.modalIconBg}>
            <Ionicons name="key-outline" size={28} color="#2563eb" />
          </View>
          <Text style={styles.modalTitle}>Reset Password</Text>
          <Text style={styles.modalSub}>Enter your registered email address and we'll send you a link to reset your password.</Text>
          
          <TextInput 
            value={email} 
            onChangeText={setEmail} 
            placeholder="example@email.com" 
            autoCapitalize="none" 
            style={styles.modalInput} 
            placeholderTextColor="#94a3b8"
          />
          
          <View style={styles.modalBtnRow}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancelBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={resetPassword} style={styles.modalSendBtn}>
                <Text style={styles.modalSendText}>Send Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: "#f8fafc" 
  },
  
  
  headerContainer: {
    height: height * 0.25,    
    width: '100%',
  },
  gradientHeader: {
    flex: 1,
    paddingTop: 40, 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingTop: 60, 
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
    overflow: 'hidden'
  },
  
  // Decorative Circles (Background designs)
  circle1: { position: 'absolute', top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)' },
  circle2: { position: 'absolute', bottom: -20, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },

  headerContent: {
    alignItems: 'center',
    
  },
  headerImage: {
    width: 200, // Logo thoda chhota kiya taaki text ke liye jagah bache
    height: 50,
    marginBottom: 10,
    tintColor: 'white' 
  },
  headerTitle: {
    color: 'white',
    fontSize: 26, // Font thoda balance kiya
    fontWeight: '800',
    letterSpacing: 0.5
  },
  headerSubtitle: {
    color: '#e0e7ff', 
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    opacity: 0.9
  },

  // Scroll Content
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 10
  },

  // Floating Card - Margin adjust kiya (Fix here)
  floatingCard: {
    width: width * 0.9, 
    backgroundColor: 'white',
    marginTop: 1, // -60 se -40 kiya (Card thoda neeche aayega)
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10, 
  },

  // Inputs
  label: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
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
    height: 56, 
    marginBottom: 20
  },
  inputFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff"
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#1e293b", fontWeight: "500" },
  
  // Forgot Password
  forgotPassBtn: { alignSelf: "flex-end", marginBottom: 24, marginTop: -8 },
  forgotPassText: { color: "#2563eb", fontWeight: "600", fontSize: 13 },
  
  // Login Button
  shadowBtn: {
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8
  },
  loginBtn: { 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: "center",
  },
  loginBtnText: { color: "#ffffff", fontSize: 17, fontWeight: "bold", letterSpacing: 0.5 },

  // Divider
  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 26 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
  dividerText: { marginHorizontal: 12, color: "#94a3b8", fontSize: 13, fontWeight: "500" },

  // Google Button
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
  googleBtnText: { fontSize: 16, fontWeight: "600", color: "#334155", marginLeft: 12 },

  // Footer
  footerContainer: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  footerText: { color: "#64748b", fontSize: 14, fontWeight: "500" },
  signupText: { color: "#2563eb", fontWeight: "bold", fontSize: 14 },

  // Modal
  modalContent: { backgroundColor: "white", padding: 24, borderRadius: 24 },
  modalIconBg: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b", textAlign: "center", marginBottom: 8 },
  modalSub: { fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 24, paddingHorizontal: 10, lineHeight: 20 },
  modalInput: { backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 24 },
  modalBtnRow: { flexDirection: "row", gap: 12 },
  modalCancelBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  modalCancelText: { color: "#64748b", fontWeight: "700" },
  modalSendBtn: { flex: 1, backgroundColor: "#2563eb", padding: 14, borderRadius: 12, alignItems: "center" },
  modalSendText: { color: "white", fontWeight: "700" },
});

export default Login;