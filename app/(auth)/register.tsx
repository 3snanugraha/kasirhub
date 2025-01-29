import { Text, View, TextInput, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
// import RoundVariation from "@/components/RoundVariation";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { register, login } from "@/utils/Pocketbase";
import Toast from "react-native-toast-message";

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const result = await register(email, password);
      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Registrasi Berhasil",
          text2: "Silakan tunggu, anda akan login otomatis",
        });

        // Auto login after successful registration
        const loginResult = await login(email, password);
        if (loginResult.success) {
          router.replace("/(dashboard)");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Registrasi Gagal",
          text2: "Email sudah terdaftar atau tidak valid",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Terjadi kesalahan, silakan coba lagi",
      });
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 rounded-b-3xl">
        <Pressable onPress={() => router.back()} className="p-2">
          <AntDesign
            name="left"
            size={24}
            style={{ color: "#fff" }}
            className="bg-blue-600 rounded-xl p-2"
          />
        </Pressable>
        <Text className="flex-1 text-2xl font-bold text-blue-600 text-center mr-8">
          Daftar Akun
        </Text>
      </View>

      {/* Image Section */}
      <View className="items-center justify-center my-4">
        <Image
          source={require("@/assets/images/splash.png")}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </View>

      {/* Form Section */}
      <View className="flex-1 px-6">
        <View className="space-y-6">
          <View>
            <Text className="text-gray-600 mb-2 font-medium">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Masukkan email anda"
              className="bg-gray-50 px-4 py-5 rounded-xl text-gray-800"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-2 font-medium">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password"
                className="bg-gray-50 px-4 py-5 rounded-xl text-gray-800 pr-12"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-5"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            className={`bg-blue-600 py-3 px-4 rounded-xl mt-4 ${
              isLoading ? "opacity-50" : ""
            }`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? "Loading..." : "Daftar"}
            </Text>
          </Pressable>
        </View>

        {/* OAuth Section */}
        <View className="mt-8">
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500">atau daftar dengan</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          <Pressable className="flex-row items-center justify-center space-x-2 border border-gray-300 py-3 px-4 rounded-xl">
            <AntDesign name="google" size={20} color="#DB4437" />
            <Text className="text-gray-700 font-medium">
              Daftar dengan Google
            </Text>
          </Pressable>
        </View>

        {/* Login Link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Sudah punya akun? </Text>
          <Pressable onPress={() => router.replace("/(auth)/login")}>
            <Text className="text-blue-600 font-medium">Masuk</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
