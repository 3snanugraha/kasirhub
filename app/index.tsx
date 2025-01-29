import {
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  Switch,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import RoundVariation from "@/components/RoundVariation";
import AppConfig from "@/config/AppConfig";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  useEffect(() => {
    const initConfig = async () => {
      await AppConfig.initialize();
      const splashEnabled = AppConfig.getIsSplashScreen();
      setShowSplash(splashEnabled);

      if (!splashEnabled) {
        router.replace("/(auth)/login");
      }
    };
    initConfig();
  }, []);

  const toggleSplashScreen = async (value: boolean) => {
    await AppConfig.setIsSplashScreen(value);
    setShowSplash(value);
  };

  const slides = [
    {
      image: require("@/assets/images/splash.png"),
      caption: "Manajemen Mudah untuk Toko Anda",
    },
    {
      image: require("@/assets/images/splash-2.png"),
      caption: "Kontrol Penjualan toko anda di mana saja kapan saja",
    },
    {
      image: require("@/assets/images/splash-3.png"),
      caption:
        "Jangan khawatir data penjualan hilang karena Kasirhub sudah menggunakan cloud database online backup",
    },
  ];

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  return (
    <View className="flex-1 bg-white">
      <RoundVariation />

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-3xl font-bold text-blue-600 mb-8">KasirHub</Text>

        <View style={{ width: width - 48 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollRef}
            contentContainerStyle={{
              width: (width - 48) * slides.length,
            }}
          >
            {slides.map((slide, index) => (
              <View
                key={index}
                style={{ width: width - 48 }}
                className="items-center"
              >
                <Image
                  source={slide.image}
                  className="w-[300px] h-[300px]"
                  resizeMode="contain"
                />
                <Text className="text-gray-600 text-center mt-4 px-4">
                  {slide.caption}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row justify-center space-x-3 my-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                index === activeIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </View>

        <View className="w-full space-y-4 gap-y-2">
          <Pressable
            className="bg-blue-600 py-3 px-4 rounded-full"
            onPress={() => router.push("/(auth)/register")}
          >
            <Text className="text-white text-center font-medium">
              Buat Akun Baru
            </Text>
          </Pressable>

          <Pressable
            className="border border-blue-600 py-3 px-4 rounded-full"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-blue-600 text-center font-medium">Masuk</Text>
          </Pressable>
        </View>

        <View className="w-full space-y-4 mt-1">
          <View className="flex-row items-center justify-center space-x-2 mb-4">
            <Switch
              value={showSplash}
              onValueChange={toggleSplashScreen}
              trackColor={{ false: "#767577", true: "#2563eb" }}
              thumbColor={'#f4f3f4'}
            />
            <Text className="text-gray-600">Tampilkan Start Screen</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
