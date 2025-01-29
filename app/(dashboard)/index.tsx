import { Text, View, BackHandler, Alert } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "@/utils/Pocketbase";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Konfirmasi Logout", 
        "Apakah anda akan logout?",
        [
          {
            text: "Tidak",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "Ya",
            onPress: async () => {
              await logout();
              router.replace("/(auth)/login");
            }
          }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-blue-600">
          Dashboard
        </Text>
      </View>
    </SafeAreaView>
  );
}
