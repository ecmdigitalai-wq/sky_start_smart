import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

const BookInfo = ({ navigation, route }) => {
  const { item } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${item.grade}`,
    });
  }, []);

  return (
    <View className="flex-1 bg-slate-100 h-full relative">
      <ScrollView>
        <View className="h-fit bg-blue-200 rounded-b-3xl">
          <Image
            source={
              item.image !== ""
                ? { uri: item.image }
                : require("../assets/splash.png")
            }
            className="w-[188px] h-60 max-w-[500px] rounded-xl mx-auto  mt-4 mb-10"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 px-5 pt-6 space-y-2 pb-20">
          <Text className="text-lg font-semibold">{item.title}</Text>
          <View className="flex justify-between items-center flex-row">
            <Text className="text-md text-gray-400">by {item.author}</Text>
            <Text className="rounded-full bg-blue-200 p-2 px-4">
              {item.subject}
            </Text>
          </View>
          <Text className="text-lg font-semibold">Description</Text>
          <View className="flex-1 ">
            <Text>{item.description}</Text>
          </View>
        </View>
      </ScrollView>
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "white", "white"]}
        className="absolute right-0 left-0 bottom-0"
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("BookPreview", { item: item })}
          style={{
            elevation: 20,
            shadowColor: "#3b82f6",
          }}
          className="bg-blue-500 rounded-full p-2 my-3 mx-5"
        >
          <Text className="text-center text-lg font-semibold text-white">
            View Now
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default BookInfo;
