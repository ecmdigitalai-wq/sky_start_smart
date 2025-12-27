import React, { useLayoutEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  StatusBar,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const BookInfo = ({ navigation, route }) => {
  const { item } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.fixedHeader}>
        <LinearGradient
          colors={["#2563eb", "#1e40af"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            
            <View style={styles.bookWrapper}>
                <View style={styles.bookShadow}>
                  <Image
                      source={
                      item.image && item.image !== ""
                          ? { uri: item.image }
                          : require("../assets/splash.png")
                      }
                      style={styles.bookImage}
                      resizeMode="cover"
                  />
                </View>
            </View>
        </LinearGradient>
      </View>

      <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.floatingBackBtn}
      >
          <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacer} />

        <View style={styles.contentCard}>
           
           <View style={styles.indicatorBar} />

           <View style={styles.metaRow}>
              <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.subject || "General"}</Text>
              </View>
              <View style={[styles.badge, styles.gradeBadge]}>
                  <Text style={[styles.badgeText, styles.gradeText]}>{item.grade || "All Grades"}</Text>
              </View>
           </View>

           <Text style={styles.title}>{item.title}</Text>
           <Text style={styles.author}>by {item.author || "Unknown Author"}</Text>
           
           <View style={styles.divider} />

           <Text style={styles.sectionTitle}>Description</Text>
           <Text style={styles.description}>
             {item.description || "No description available for this book. Click the button below to start reading."}
           </Text>
           <View style={{height: 100}} /> 
        </View>
      </ScrollView>

      <View style={styles.footer}>
         <TouchableOpacity
           onPress={() => navigation.navigate("BookPreview", { item: item })}
           activeOpacity={0.8}
           style={styles.readBtn}
         >
           <Text style={styles.readBtnText}>Read Now</Text>
           <Ionicons name="book-outline" size={20} color="white" style={{marginLeft: 8}}/>
         </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6, 
    zIndex: 0,
  },
  gradientHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40
  },
  circle1: { position: "absolute", top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)" },
  circle2: { position: "absolute", bottom: 100, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.1)" },
  
  floatingBackBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
  },

  bookWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  bookShadow: {
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    backgroundColor: "transparent",
  },
  bookImage: {
    width: 220,
    backgroundColor: "transparent",
    height: 290, 
     elevation: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)"
  },

  scrollContent: {
    flexGrow: 1,
  },
  spacer: {
    height: height * 0.55, 
  },
  contentCard: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 16,
    minHeight: height * 0.6,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  indicatorBar: {
    width: 40,
    height: 5,
    backgroundColor: "#e2e8f0",
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 24
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 10
  },
  badge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dbeafe"
  },
  gradeBadge: {
    backgroundColor: "#fff7ed",
    borderColor: "#ffedd5"
  },
  badgeText: {
    color: "#2563eb",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  gradeText: {
    color: "#c2410c"
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 4
  },
  author: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 26,
    textAlign: "left",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    zIndex: 20
  },
  readBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  readBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default BookInfo;