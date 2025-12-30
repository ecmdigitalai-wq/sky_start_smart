import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; 
import useFetch from "../hook/useFetch";

const { width } = Dimensions.get("window");

const TermEdition = ({ navigation }) => {
  const { gradeData, isLoading, error, refetch } = useFetch();
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Primary Color Constant
  const THEME_COLOR = "#8756f3";

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#faf5ff" }} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[THEME_COLOR]} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        
        {/* ================= HEADER (Gradient #8756f3) ================= */}
        <LinearGradient
          colors={["#4bb5f1ff", "#2254d1"]} // Blue to Dark Blue
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.headerBox}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
             <View>
                <Text style={styles.headerSubtitle}>
                   TERM WISE BOOKS
                </Text>
                <Text style={styles.headerTitle}>
                   Term Series
                </Text>
             </View>
             <View style={styles.iconCircle}>
                <Ionicons name="layers" size={24} color={THEME_COLOR} />
             </View>
          </View>
        </LinearGradient>

        {/* ================= LIST CONTENT ================= */}
        <View style={{ paddingHorizontal: 20, marginTop: -30 }}>
            
            {isLoading ? (
                <View style={{ marginTop: 60, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={THEME_COLOR} />
                    <Text style={{ marginTop: 10, color: '#64748b', fontWeight: '500' }}>Loading terms...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorBox}>
                    <Ionicons name="cloud-offline" size={48} color="#ef4444" />
                    <Text style={{ color: '#ef4444', marginTop: 12, fontWeight: '700', fontSize: 16 }}>Oops! Connection lost.</Text>
                    <TouchableOpacity onPress={refetch} style={styles.retryBtn}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={{ gap: 16 }}>
                    {gradeData.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.9}
                        onPress={() =>
                            navigation.navigate("GradeBooks", {
                                item: item,
                                edition: "term edition",
                            })
                        }
                        style={styles.card}
                    >
                        {/* 🟣 Image Section (Left) */}
                        <View style={styles.imageWrapper}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={
                                        item.image && item.image !== ""
                                        ? { uri: item.image }
                                        : require("../assets/splash.png") 
                                    }
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* 🟢 Content Section (Right) */}
                        <View style={{ flex: 1, paddingVertical: 12, paddingRight: 12, justifyContent: 'center' }}>
                            
                            {/* Badge */}
                            <View style={styles.badge}>
                               <Ionicons name="time" size={10} color={THEME_COLOR} style={{ marginRight: 4 }} />
                               <Text style={styles.badgeText}>TERM</Text>
                            </View>

                            {/* Title */}
                            <Text style={styles.cardTitle}>
                                {item.grade}
                            </Text>

                            {/* Call to Action */}
                            <View style={styles.actionRow}>
                                <Text style={styles.cardSubtitle}>Browse Terms</Text>
                                <View style={styles.arrowCircle}>
                                    <Ionicons name="arrow-forward" size={14} color="#ffffff" />
                                </View>
                            </View>
                        </View>

                        {/* Background Decoration */}
                        <Ionicons name="layers" size={90} color="#f3e8ff" style={{ position: 'absolute', right: -10, bottom: -15, zIndex: -1, opacity: 0.8 }} />

                    </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 🎨 CUSTOM STYLES FOR #8756f3
const styles = StyleSheet.create({
  headerBox: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#8756f3", // Theme Color Shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },
  headerSubtitle: {
    color: "#e9d5ff", // Light Purple Text
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.5
  },
  iconCircle: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 50,
    elevation: 4,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 }
  },
  
  // Card Design
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    flexDirection: "row",
    shadowColor: "#8756f3", // Theme Shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ffffff",
    overflow: 'hidden',
    height: 130, 
  },
  imageWrapper: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3e8ff', // Very light theme bg for image
    borderRightWidth: 1,
    borderRightColor: '#e9d5ff',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  imageContainer: {
    width: 70,
    height: 90,
    shadowColor: "#6b21a8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4
  },
  
  // Content Styles
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 8,
    marginTop: 4,
    marginLeft: 16
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginLeft: 16,
    paddingTop: 8
  },
  cardSubtitle: {
    color: "#8756f3", // Theme Text
    fontSize: 13,
    fontWeight: "600",
  },
  arrowCircle: {
    backgroundColor: "#8756f3", // Theme Button
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: "#f3e8ff", // Light Theme Badge
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16
  },
  badgeText: {
    color: "#6b21a8", // Darker text for readability
    fontSize: 10,
    fontWeight: "bold"
  },

  // Error State
  errorBox: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 24,
    shadowColor: "#ef4444",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#ef4444",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 }
  }
});

export default TermEdition;