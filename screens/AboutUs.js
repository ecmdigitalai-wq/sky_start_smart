import React, { useLayoutEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  StatusBar, 
  Platform,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const AboutUs = ({ navigation }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
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

          <View style={styles.navBar}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.iconBtn}
            >
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>About Us</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoSection}>
            <View style={styles.logoBg}>
                <Ionicons name="book" size={40} color="#2563eb" />
            </View>
            <Text style={styles.brandName}>SKY BOOKS</Text>
            <Text style={styles.tagline}>Revolutionizing Learning Systems</Text>
          </View>
        </LinearGradient>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.contentCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.blueBar} />
                <Text style={styles.sectionTitle}>Who We Are</Text>
            </View>
            <Text style={styles.paragraph}>
                <Text style={styles.boldBlue}>SKY BOOKS</Text> is a fast-growing, research-driven company dedicated to revolutionizing learning systems. We publish high-quality educational material and provide support services to both learners and educators.
            </Text>

            <View style={styles.divider} />

            <View style={styles.sectionHeader}>
                <Ionicons name="people-circle-outline" size={26} color="#3b82f6" style={{marginRight: 8}} />
                <Text style={styles.sectionTitle}>Our Expertise</Text>
            </View>
            <Text style={styles.paragraph}>
                Our Authors, Editors, and Educational Consultants possess a collective experience of over <Text style={styles.boldText}>20 years</Text> in Teaching, Publishing, and Curriculum Design.
            </Text>
        </View>

        <Text style={styles.subHeader}>OUR PHILOSOPHY</Text>
        
        <View style={styles.gridContainer}>
            <View style={[styles.gridBox, { borderTopColor: '#3b82f6' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
                    <Ionicons name="bulb-outline" size={24} color="#3b82f6" />
                </View>
                <Text style={styles.boxTitle}>Innovation</Text>
                <Text style={styles.boxText}>Moving beyond rote learning to self-learning.</Text>
            </View>

            <View style={[styles.gridBox, { borderTopColor: '#eab308' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#fefce8' }]}>
                    <Ionicons name="rocket-outline" size={24} color="#ca8a04" />
                </View>
                <Text style={styles.boxTitle}>Skills</Text>
                <Text style={styles.boxText}>Developing critical 21st-century skills.</Text>
            </View>
        </View>

        <View style={styles.supportCard}>
            <View style={styles.supportHeader}>
                <Text style={styles.supportTitle}>Complete Support</Text>
                <Ionicons name="headset" size={24} color="#60a5fa" />
            </View>
            <Text style={styles.supportText}>
                We empower educators with print, digital, and interactive resources to optimize teaching time effectively.
            </Text>
        </View>

        <Text style={styles.footerText}>© SKY BOOKS PUBLISHERS</Text>
        <View style={{height: 30}} />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerContainer: {
    height: height * 0.35,
    width: "100%",
  },
  gradientHeader: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 0,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: "relative",
    overflow: "hidden",
  },
  circle1: { position: "absolute", top: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.1)" },
  circle2: { position: "absolute", bottom: -20, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.1)" },
  
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    zIndex: 10
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  logoBg: {
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  tagline: {
    color: '#dbeafe',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500'
  },

  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center'
  },
  contentCard: {
    width: width * 0.9,
    backgroundColor: "white",
    marginTop: 2,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  blueBar: {
    width: 4,
    height: 24,
    backgroundColor: '#2563eb',
    borderRadius: 2,
    marginRight: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  paragraph: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    textAlign: 'justify'
  },
  boldBlue: {
    fontWeight: 'bold',
    color: '#2563eb'
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1e293b'
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20
  },

  subHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    alignSelf: 'flex-start',
    marginLeft: width * 0.05,
    marginBottom: 16
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginBottom: 24
  },
  gridBox: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6
  },
  boxText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18
  },

  supportCard: {
    width: width * 0.9,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    marginBottom: 30
  },
  supportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  supportTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  supportText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5
  }
});

export default AboutUs;