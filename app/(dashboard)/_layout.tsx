import { View, Text, Pressable } from "react-native";
import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout() {
  return (
    <View className="flex-1">
      <Sidebar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            backgroundColor: "#dce1fc",
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
            borderTopWidth: 0,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Beranda",
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center">
                <AntDesign
                  name="home"
                  size={24}
                  color={focused ? "#2563eb" : "#94a3b8"}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                className={`text-xs ${
                  focused ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Beranda
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="transaction"
          options={{
            title: "Transaksi",
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center">
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color={focused ? "#2563eb" : "#94a3b8"}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                className={`text-xs ${
                  focused ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Transaksi Baru
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "Pengaturan",
            tabBarIcon: ({ color, focused }) => (
              <View className="items-center">
                <AntDesign
                  name="setting"
                  size={24}
                  color={focused ? "#2563eb" : "#94a3b8"}
                />
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                className={`text-xs ${
                  focused ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Pengaturan
              </Text>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
