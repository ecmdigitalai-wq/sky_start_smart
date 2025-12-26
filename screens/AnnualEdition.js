import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ImageBackground,
  useColorScheme,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import useFetch from "../hook/useFetch";

const AnnualEdition = ({ navigation }) => {
  const { gradeData, isLoading, error, refetch } = useFetch();

  const [isLight, setIsLight] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  let colorScheme = useColorScheme();

  useEffect(() => {
    setIsLight(colorScheme === "light");
  }, [colorScheme]);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  return (
    <View className="flex-1">
      {isLight && (
        <ImageBackground
          source={{
            uri: "https://www.transparenttextures.com/patterns/brick-wall.png",
          }}
          className="w-full h-full absolute bg-white opacity-10" // Opacity handled here
          resizeMode="repeat"
        />
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text className="m-4 text-lg font-bold">What would you like to learn today?</Text>

        <View className="flex flex-row flex-wrap justify-center">
          {isLoading ? (
            <View className="mt-10">
              <ActivityIndicator size="large" color="#312651" />
            </View>
          ) : error ? (
            <Text className="text-red-500 text-center mt-4">Something went wrong</Text>
          ) : (
            gradeData.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="w-[90%] p-4 my-2 bg-blue-100 rounded-xl flex-row justify-between items-center"
                onPress={() =>
                  navigation.navigate("GradeBooks", {
                    item: item,
                    edition: "annual edition",
                  })
                }
                // Style moved to className mostly, keeping elevation safe
                style={{
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                {/* Image Container with Background Color for Safe Elevation */}
                <View
                  className="bg-white rounded-lg p-1"
                  style={{
                    elevation: 5, // Android needs background color to render shadow
                    shadowColor: isLight ? "black" : "white",
                  }}
                >
                  <Image
                    source={
                      item.image && item.image !== ""
                        ? { uri: item.image }
                        : require("../assets/splash.png")
                    }
                    className="w-24 h-24"
                    resizeMode="contain"
                  />
                </View>

                <View className="flex-1 justify-center items-center ml-4">
                  <Text className="text-xl font-semibold text-center">
                    {item.grade}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AnnualEdition;