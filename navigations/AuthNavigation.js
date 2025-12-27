import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "../screens/Signup";
import Login from "../screens/Login";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();

function NavigationGroup() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

const AuthNavigation = () => {
  return (
    <>
      <StatusBar style="auto" />
      <NavigationGroup />
    </>
  );
};

export default AuthNavigation;