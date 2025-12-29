import React, { useEffect } from "react";
import { View, Image, StatusBar, Platform, StyleSheet, TouchableOpacity, Text } from "react-native";
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

function CustomTopTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabWrapper}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let activeColor = "#333333"; 
          if (route.name === "AnnualEdition") activeColor = "#9C27B0";
          if (route.name === "TermEdition") activeColor = "#204ac0";
          if (route.name === "SemesterEdition") activeColor = "#8754f2";

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused 
                ? { backgroundColor: activeColor, elevation: 4, shadowColor: activeColor, shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: {width: 0, height: 2} } 
                : { backgroundColor: "transparent" }
              ]}
            >
              <Text style={{ 
                color: isFocused ? "#ffffff" : "#64748b",
                fontWeight: isFocused ? "700" : "600",
                fontSize: 14,
                textTransform: "capitalize"
              }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function TopTabGroup() {
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>      
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      
      <SafeAreaView edges={['top']} style={{ backgroundColor: "#ffffff", zIndex: 10 }}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/loginHeader.png")}
            style={{ width: 160, height: 36, marginTop: 4 }}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>

      <TopTab.Navigator
        tabBar={props => <CustomTopTabBar {...props} />}
      >
        <TopTab.Screen 
          name="AnnualEdition" 
          component={AnnualEdition} 
          options={{ tabBarLabel: "Annual Edition" }} 
        />
        <TopTab.Screen 
          name="TermEdition" 
          component={TermEdition} 
          options={{ tabBarLabel: "Term Edition" }} 
        />
        <TopTab.Screen 
          name="SemesterEdition" 
          component={SemesterEdition} 
          options={{ tabBarLabel: "Semester Edition" }} 
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
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 5,
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
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0,
    width: "100%",
    elevation: 2, 
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    marginBottom: 0
  },
  tabWrapper: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 30,
    padding: 4,
    height: 48,
    alignItems: 'center'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    height: '100%',
  }
});