import React, { useEffect } from "react";
import { View, Image, StatusBar, Platform, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { SafeAreaView } from "react-native-safe-area-context";

import MyAccount from "../screens/MyAccount";
import BookInfo from "../screens/BookInfo";
import BookPreview from "../screens/BookPreview";
import AboutUs from "../screens/AboutUs";
import GradeBooks from "../screens/GradeBooks";
import AnnualEdition from "../screens/AnnualEdition";
import TermEdition from "../screens/TermEdition";
import SemesterEdition from "../screens/SemesterEdition";

const TopTab = createMaterialTopTabNavigator();

function TopTabGroup() {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* ✅ STATUS BAR FIX: Translucent aur Transparent kiya taaki icons dikhein */}
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      {/* SafeAreaView ab Status Bar ke liye jagah (padding) banayega */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: "#ffffff", zIndex: 10 }}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/loginHeader.png")}
            style={{ width: 140, height: 40 }}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      <TopTab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#64748b",
          tabBarPressColor: "#eff6ff",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#f1f5f9",
            // Fixed height hata di hai taaki content adjust ho sake
          },
          tabBarIndicatorStyle: {
            backgroundColor: "#2563eb",
            height: 3,
            borderRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "700",
            textTransform: "capitalize",
          },
        }}
      >
        <TopTab.Screen 
          name="AnnualEdition" 
          component={AnnualEdition} 
          options={{ tabBarLabel: "Annual" }} 
        />
        <TopTab.Screen 
          name="TermEdition" 
          component={TermEdition} 
          options={{ tabBarLabel: "Term" }} 
        />
        <TopTab.Screen 
          name="SemesterEdition" 
          component={SemesterEdition} 
          options={{ tabBarLabel: "Semester" }} 
        />
      </TopTab.Navigator>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function HomeStackGroup() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabGroup" component={TabGroup} />
      <Stack.Screen name="BookPreview" component={BookPreview} />
      <Stack.Screen name="BookInfo" component={BookInfo} />
      <Stack.Screen name="GradeBooks" component={GradeBooks} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabGroup() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: Platform.OS === 'android' ? 65 : 85,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          elevation: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'android' ? 10 : 30,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -4
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName = "home-outline";

          if (route.name === "TopTabGroup") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "MyAccount") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
               <View style={{
                 backgroundColor: focused ? "#eff6ff" : "transparent",
                 paddingHorizontal: 16,
                 paddingVertical: 4,
                 borderRadius: 20,
                 marginBottom: 2
               }}>
                  <Ionicons name={iconName} size={24} color={color} />
               </View>
            </View>
          );
        },
      })}
    >
      <Tab.Screen 
        name="TopTabGroup" 
        component={TopTabGroup} 
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen 
        name="MyAccount" 
        component={MyAccount} 
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  useEffect(() => {
    const updateOrientation = async () => {
      await ScreenOrientation.unlockAsync();
    };
    updateOrientation();
  }, []);

  return (
     <HomeStackGroup />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    width: "100%"
  }
});