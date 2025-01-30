import { Text, View, BackHandler, Alert, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout, checkEmailVerification } from "@/utils/Pocketbase";

export default function Setting() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    checkVerification();
  }, []);

  const checkVerification = async () => {
    const { verified } = await checkEmailVerification();
    setIsVerified(verified);
  };

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
        <Text className="text-2xl font-bold text-blue-600 mb-4">
          Setting
        </Text>
        
        {!isVerified && (
          <View className="items-center px-6">
            <Text className="text-red-500 text-center mb-4">
              Email belum terverifikasi
            </Text>
            <Pressable 
              className="bg-blue-600 py-3 px-6 rounded-xl"
              onPress={() => router.push("/(auth)/verification")}
            >
              <Text className="text-white font-medium">
                Verifikasi Email
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
