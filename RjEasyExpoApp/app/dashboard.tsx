// app/dashboard.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { WEBSITE_REDIRECT } from "@env";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = await AsyncStorage.getItem("authToken");
      if (!savedToken) router.replace("/login");
      else setToken(savedToken);
    };
    checkToken();
  }, []);

  if (!token)
    return <ActivityIndicator size="large" style={{ marginTop: 200 }} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={{
          height: 50,
          backgroundColor: "#B84034",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>
          RJ Easy Softech
        </Text>

        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem("authToken");
            router.replace("/login");
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Live Website Render Below */}
      <WebView
        source={{ uri: "https://www.google.com" }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        allowUniversalAccessFromFileURLs={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        originWhitelist={['*']}
        onError={(e) => console.log('WebView error:', e.nativeEvent)}
        injectedJavaScript={`
          const meta = document.createElement('meta');
          meta.setAttribute('name','viewport');
          meta.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
          document.head.appendChild(meta);
          true;
        `}
        style={{ flex: 1 }}
      />

    </SafeAreaView>
  );
}
