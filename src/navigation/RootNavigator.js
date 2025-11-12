import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import LevelQuestionScreen from "../screens/Onboarding/LevelQuestionScreen";
import HomeScreen from "../screens/Home/HomeScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Iniciar sesión" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Registro" }} />
      <Stack.Screen name="LevelQuestion" component={LevelQuestionScreen} options={{ title: "Nivel de inglés" }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "KeIA" }} />
    </Stack.Navigator>
  );
}
