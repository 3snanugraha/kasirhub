import { Text, View, Pressable, Image, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import {
  requestVerification,
  confirmVerification,
  getCurrentUser,
} from "@/utils/Pocketbase";
import LottieView from "lottie-react-native";

export default function Verification() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const [countdown, setCountdown] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success"
  >("pending");

  useEffect(() => {
    const sendInitialVerification = async () => {
      const user = getCurrentUser();
      if (user?.email) {
        await requestVerification(user.email);
      }
    };

    sendInitialVerification();
  }, []);

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const token = url.split("token=")[1];
      if (token) {
        handleVerification(token);
      }
    };

    Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      Linking.removeAllListeners("url");
    };
  }, []);

  useEffect(() => {
    if (token) {
      handleVerification(token as string);
    }
  }, [token]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !isResendActive) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendActive(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerification = async (verificationToken: string) => {
    setIsLoading(true);
    try {
      const result = await confirmVerification(verificationToken);
      if (result.success) {
        setVerificationStatus("success");
        Toast.show({
          type: "success",
          text1: "🎉 Selamat!",
          text2: "Email anda berhasil diverifikasi",
        });

        setTimeout(() => {
          router.replace("/(dashboard)");
        }, 3000);
      } else {
        Toast.show({
          type: "error",
          text1: "Verifikasi Gagal",
          text2: "Token tidak valid atau sudah kadaluarsa",
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

  const handleResendEmail = async () => {
    setIsLoading(true);
    const user = getCurrentUser();

    if (!user) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "User tidak ditemukan",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await requestVerification(user.email);
      if (result.success) {
        Toast.show({
          type: "success",
          text1: "Email Terkirim",
          text2: "Silakan cek inbox email anda",
        });
        setCountdown(60);
        setIsResendActive(false);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Gagal Mengirim Email",
        text2: "Silakan coba lagi nanti",
      });
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-blue-600 rounded-b-3xl">
        <Pressable onPress={() => router.back()} className="p-2">
          <AntDesign name="arrowleft" size={24} style={{ color: "#fff" }} />
        </Pressable>
        <Text className="flex-1 text-xl font-semibold text-white text-center mr-8">
          Verifikasi Email
        </Text>
      </View>

      {verificationStatus === "pending" ? (
        <>
          {/* Image Section */}

          {/* Content Section */}
          <View className="flex-1 px-6">
            <View className="space-y-6">
              <View className="items-center">
                <LottieView
                  source={require("@/assets/animation/sending.json")}
                  autoPlay
                  loop={true}
                  style={{ width: 340, height: 340 }}
                />
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                  Cek Email Anda
                </Text>
                <Text className="text-gray-600 text-center">
                  Kami telah mengirimkan link verifikasi ke email anda. Silakan
                  cek inbox atau folder spam.
                </Text>
              </View>

              {/* Timer Section */}
              <View className="items-center space-y-4">
                <View className="bg-blue-50 rounded-full p-4">
                  <Text className="text-blue-600 font-semibold text-xl">
                    {Math.floor(countdown / 60)}:
                    {countdown % 60 < 10 ? "0" : ""}
                    {countdown % 60}
                  </Text>
                </View>
                <Text className="text-gray-500">Belum menerima email?</Text>
              </View>

              {/* Resend Button */}
              <Pressable
                className={`border border-blue-600 py-3 px-4 rounded-xl ${
                  isResendActive ? "bg-blue-600" : "bg-gray-100"
                } ${isLoading ? "opacity-50" : ""}`}
                onPress={handleResendEmail}
                disabled={!isResendActive || isLoading}
              >
                <Text
                  className={`text-center font-semibold ${
                    isResendActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {isLoading ? "Loading..." : "Kirim Ulang Email"}
                </Text>
              </Pressable>

              {/* Back to Dashboard */}
              <Pressable
                className="mt-4"
                onPress={() => router.replace("/(dashboard)")}
              >
                <Text className="text-blue-600 text-center font-medium">
                  Kembali ke Dashboard
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        // Success Animation View
        <View className="flex-1 items-center justify-center px-6">
          <LottieView
            source={require("@/assets/animation/success.json")}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
          <Text className="text-2xl font-bold text-green-600 mt-4">
            Verifikasi Berhasil!
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Selamat datang di KasirHub
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
