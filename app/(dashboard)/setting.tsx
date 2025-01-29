import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "@/utils/Pocketbase";
import { useRouter } from "expo-router";

export default function Setting() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-blue-600">Pengaturan</Text>
        <Pressable
          className="bg-blue-600 py-3 px-6 rounded-xl mt-4"
          onPress={handleLogout}
        >
          <Text className="text-white font-medium">Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
