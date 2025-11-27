// app/index.tsx
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setTimeout(() => {
        if (token) router.replace("/dashboard");
        else router.replace("/login");
      }, 800);
    };
    checkSession();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>RJ Easy App</Text>
      <ActivityIndicator size="large" style={{ marginTop: 20 }} />
    </View>
  );
}
