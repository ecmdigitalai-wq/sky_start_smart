import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

// Screens
import MyAccount from "../screens/MyAccount";
import BookInfo from "../screens/BookInfo";
import BookPreview from "../screens/BookPreview";
import AboutUs from "../screens/AboutUs";
import GradeBooks from "../screens/GradeBooks";
import AnnualEdition from "../screens/AnnualEdition";
import TermEdition from "../screens/TermEdition";
import SemesterEdition from "../screens/SemesterEdition";

// ================= TOP TAB =================
const TopTab = createMaterialTopTabNavigator();

function TopTabGroup() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: "capitalize",
          fontWeight: "bold",
          fontSize: 11,
        },
      }}
    >
      <TopTab.Screen name="Term Edition" component={TermEdition} />
      <TopTab.Screen name="Annual Edition" component={AnnualEdition} />
      <TopTab.Screen name="Semester Edition" component={SemesterEdition} />
    </TopTab.Navigator>
  );
}

// ================= STACK =================
const Stack = createNativeStackNavigator();

function HomeStackGroup() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabGroup"
        component={TabGroup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookPreview"
        component={BookPreview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookInfo"
        component={BookInfo}
        options={{
          headerStyle: { backgroundColor: "#bfdbfe" },
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen 
  name="GradeBooks" 
  getComponent={() => require("../screens/GradeBooks").default} 
/>
      <Stack.Screen name="About Us" component={AboutUs} />
    </Stack.Navigator>
  );
}

// ================= BOTTOM TAB =================
const Tab = createBottomTabNavigator();

function TabGroup() {
  return (
    <Tab.Navigator
      initialRouteName="TopTabGroup"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "ellipse";

          if (route.name === "TopTabGroup") {
            iconName = focused ? "home-sharp" : "home-outline";
          }

          if (route.name === "MyAccount") {
            iconName = focused
              ? "settings-sharp"
              : "settings-outline"; // ✅ FIXED
          }

          return (
            <Ionicons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="TopTabGroup"
        component={TopTabGroup}
        options={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerTitle: () => (
            <Image
              style={{ width: 200, height: 50 }}
              source={require("../assets/loginHeader.png")}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyAccount"
        component={MyAccount}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

// ================= ROOT NAV =================
const Navigation = () => {
  const [statusBarVisible, setStatusBarVisible] = useState(false);

  useEffect(() => {
    const updateOrientation = async () => {
      try {
        const currentOrientation =
          await ScreenOrientation.getOrientationAsync();

        setStatusBarVisible(
          currentOrientation !==
            ScreenOrientation.Orientation.PORTRAIT_UP
        );
      } catch (error) {
        console.log("Orientation error:", error);
      }
    };

    const subscription =
      ScreenOrientation.addOrientationChangeListener(
        updateOrientation
      );

    updateOrientation();

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" hidden={statusBarVisible} />
      <HomeStackGroup />
    </NavigationContainer>
  );
};

export default Navigation;
