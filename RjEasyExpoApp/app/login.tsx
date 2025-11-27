// app/login.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password)
      return Alert.alert("Error", "Enter username & password");

    setLoading(true);

    try {
      console.log("API Calling =>", `${API_URL}/login`);

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (data.status === "success") {
        await AsyncStorage.setItem("authToken", data.token);

        if (data.message?.toLowerCase().includes("master")) {
          Alert.alert("Master Login", "Logged in as Master Admin");
        } else {
          Alert.alert("Success", "Login Successful");
        }

        router.replace("/dashboard");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid username/password");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Server Error", "Unable to connect to server");
    }

    setLoading(false);
  };

  
    return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Enter Username"
        placeholderTextColor="#777"
        style={[styles.input, { color: "#000" }]}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Enter Password"
        placeholderTextColor="#777"
        secureTextEntry
        style={[styles.input, { color: "#000" }]}
        onChangeText={setPassword}
      />


      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 25,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 240,
    height: 140,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "800",
    color: "#222",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 30,
    color: "#666",
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#B84034",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
  },
});
