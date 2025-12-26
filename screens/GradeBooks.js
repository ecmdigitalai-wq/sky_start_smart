import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  useColorScheme,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import MyBookCard from "../components/MyBookCard";
import useFetch from "../hook/useFetch";

const GradeBooks = ({ route, navigation }) => {
  const { data, isLoading, error, refetch } = useFetch();
  
  // ✅ Safety: Fallback empty object taaki crash na ho
  const { item, edition } = route.params || {}; 

  const [isLight, setIsLight] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  let colorScheme = useColorScheme();

  useEffect(() => {
    setIsLight(colorScheme === "light");
  }, [colorScheme]);

  // Use useLayoutEffect for smoother header updates
  useLayoutEffect(() => {
    if (item && item.grade) {
      navigation.setOptions({
        headerTitle: item.grade,
      });
    }
  }, [navigation, item]);

  // Safe filtering
  const filteredBooks =
    data?.filter(
      (book) => book.grade === item?.grade && book.edition === edition
    ) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  // ✅ Agar 'item' nahi mila toh error show karein (Crash bachane ke liye)
  if (!item) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error: No Grade Data Found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {isLight && (
        <ImageBackground
          source={{
            uri: "https://www.transparenttextures.com/patterns/brick-wall.png",
          }}
          className="w-full h-full absolute bg-white opacity-10"
          resizeMode="repeat"
        />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="m-3">
          {isLoading ? (
            <View className="mt-10">
              <ActivityIndicator size="large" color="#312651" />
            </View>
          ) : error ? (
            <Text className="text-center text-red-500 text-xl font-semibold my-5">
              Something went wrong
            </Text>
          ) : filteredBooks.length === 0 ? (
            <Text className="text-center text-gray-500 text-base my-5">
              No books found for {item.grade}
            </Text>
          ) : (
            filteredBooks.map((bookItem, index) => (
              <MyBookCard
                key={index}
                item={bookItem}
                navigation={navigation}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// 👇 YEH SABSE ZAROORI HAI (Missing tha aapke code mein)
export default GradeBooks;