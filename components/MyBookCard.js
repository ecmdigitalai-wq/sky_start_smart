import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const MyBookCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("BookInfo", { item: item })}
      style={styles.cardContainer}
    >
      {/* ================= LEFT: IMAGE ================= */}
      <View style={styles.imageContainer}>
        <Image
          source={
            item?.image && typeof item.image === 'string' && item.image.startsWith('http')
              ? { uri: item.image }
              : require("../assets/splash.png") // Apna valid fallback path check karna
          }
          style={styles.bookImage}
          resizeMode="cover"
        />
        {/* Overlay for depth */}
        <View style={styles.overlay} />
      </View>

      {/* ================= RIGHT: CONTENT ================= */}
      <View style={styles.contentContainer}>
        
        {/* TOP: Title & Action */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title || "Untitled Book"}
          </Text>
          
          <View style={styles.iconContainer}>
             <Ionicons name="chevron-forward" size={18} color="#2563eb" />
          </View>
        </View>

        {/* MIDDLE: Description */}
        <Text style={styles.description} numberOfLines={2}>
          {item.description || "No description available."}
        </Text>

        {/* BOTTOM: Tags (Grade & Subject) */}
        <View style={styles.tagsRow}>
          {/* Grade Tag */}
          <View style={styles.gradeTag}>
            <Text style={styles.gradeText}>
              {item.grade}
            </Text>
          </View>

          {/* Subject Tag */}
          {item.subject && (
            <View style={styles.subjectTag}>
                <Text style={styles.subjectText} numberOfLines={1}>
                {item.subject}
                </Text>
            </View>
          )}
        </View>

      </View>
    </TouchableOpacity>
  );
};

// 👇 Yahan maine Styles fix kiye hain taaki Image pakka show ho
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    // Shadows
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 140, // Fixed height card ke liye
  },
  imageContainer: {
    width: 100, // Fixed width image ke liye
    height: '100%',
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: 20,
    marginRight: 8,
  },
  iconContainer: {
    backgroundColor: '#eff6ff',
    padding: 6,
    borderRadius: 50,
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8, // Gap shayad purane RN version me na chale, isliye niche margin diya hai
  },
  gradeTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  gradeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
    textTransform: 'uppercase',
  },
  subjectTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4b5563',
    textTransform: 'uppercase',
  },
});

export default MyBookCard;