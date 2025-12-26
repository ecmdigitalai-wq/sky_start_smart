import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const MyBookCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      // Navigate karte waqt dhyan rakhein ki 'item' pass ho raha hai
      onPress={() => navigation.navigate("BookInfo", { item: item })}
      className="flex bg-blue-100 my-1.5 rounded-xl flex-row"
      style={{
        elevation: 5,
        backgroundColor: "#dbeafe", // ✅ Added for Android Safety (Matches bg-blue-100)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
      <Image
        source={
          item.image && item.image !== ""
            ? { uri: item.image }
            : require("../assets/splash.png")
        }
        className="w-24 h-[124px] rounded-l-xl"
        resizeMode="contain"
      />

      <View className="flex-1 justify-between m-4">
        <View className="flex-1 justify-between flex-row">
          <View className="flex-1 justify-between mr-2">
            <Text
              className="flex-1 font-bold text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text
              className="flex-1 text-xs text-gray-600"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Ionicons name="play-circle-outline" size={25} color="#3b82f6" />
          </View>
        </View>
        <View className="flex-row items-center space-x-2 justify-between mt-2">
          <Text className="text-xs text-gray-500 font-bold">{item.grade}</Text>
          <Text className="text-xs text-gray-500">{item.subject}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MyBookCard;