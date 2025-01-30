import { Text, View, BackHandler, Alert, Pressable, ScrollView, Image } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout, checkEmailVerification, getCurrentUser } from "@/utils/Pocketbase";
import { AntDesign, MaterialIcons, FontAwesome5, Ionicons, Feather } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

export default function Dashboard() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkVerification();
    loadUserData();
  }, []);

  const loadUserData = () => {
    const user = getCurrentUser();
    if (user?.email) {
      setUserName(user.name.split('@')[0]);
    }
    setIsLoading(false);
  };

  const checkVerification = async () => {
    const { verified } = await checkEmailVerification();
    setIsVerified(verified);
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Konfirmasi Keluar", 
        "Apakah anda yakin ingin keluar?",
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

  const menuCards = [
    {
      title: "Produk",
      icon: <AntDesign name="appstore1" size={24} color="#2563eb" />,
      description: "Kelola produk & kategori",
      count: "150 Items",
      route: "/products",
      bgColor: "bg-blue-50"
    },
    {
      title: "Stok",
      icon: <MaterialIcons name="inventory" size={24} color="#16a34a" />,
      description: "Manajemen stok barang",
      count: "20 Low Stock",
      route: "/inventory",
      bgColor: "bg-green-50"
    },
    {
      title: "Laporan",
      icon: <AntDesign name="barschart" size={24} color="#dc2626" />,
      description: "Analisis penjualan",
      count: "30D Report",
      route: "/reports",
      bgColor: "bg-red-50"
    },
    {
      title: "Karyawan",
      icon: <FontAwesome5 name="users" size={24} color="#9333ea" />,
      description: "Kelola staff toko",
      count: "5 Active",
      route: "/employees",
      bgColor: "bg-purple-50"
    },
    {
      title: "Pelanggan",
      icon: <MaterialIcons name="people-alt" size={24} color="#0891b2" />,
      description: "Data pelanggan setia",
      count: "89 Members",
      route: "/customers",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Supplier",
      icon: <MaterialIcons name="local-shipping" size={24} color="#ea580c" />,
      description: "Manajemen pemasok",
      count: "12 Partners",
      route: "/suppliers",
      bgColor: "bg-orange-50"
    }
  ];

  const quickActions = [
    {
      title: "Transaksi Baru",
      icon: <Ionicons name="cart" size={24} color="#fff" />,
      bgColor: "bg-blue-600",
      route: "/(dashboard)/transaction"
    },
    {
      title: "Scan Barcode",
      icon: <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />,
      bgColor: "bg-purple-600",
      route: "/scan"
    },
    {
      title: "Retur Barang",
      icon: <Feather name="refresh-ccw" size={24} color="#fff" />,
      bgColor: "bg-orange-600",
      route: "/returns"
    }
  ];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <LottieView
          source={require("@/assets/animation/loading.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 pt-4 pb-6 bg-blue-600 rounded-b-3xl">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white text-lg">Selamat Datang 👋</Text>
            <Text className="text-2xl font-bold text-white">
              {userName || "User"}
            </Text>
          </View>
          <Pressable 
            className="bg-blue-500 p-2 rounded-full"
            onPress={() => router.push("/(dashboard)/setting")}
          >
            <AntDesign name="user" size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between mt-2">
          <View className="bg-blue-500 p-4 rounded-xl flex-1 mr-2">
            <Text className="text-white font-bold text-xl">Rp 2.5M</Text>
            <Text className="text-white opacity-80">Penjualan Bulan Ini</Text>
          </View>
          <View className="bg-blue-500 p-4 rounded-xl flex-1 ml-2">
            <Text className="text-white font-bold text-xl">284</Text>
            <Text className="text-white opacity-80">Transaksi Hari Ini</Text>
          </View>
        </View>
      </View>

      {!isVerified && (
        <View className="bg-red-50 mx-6 mt-4 p-4 rounded-xl">
          <Text className="text-red-500 text-center mb-2">
            Email belum terverifikasi
          </Text>
          <Pressable 
            className="bg-red-500 py-2 px-4 rounded-lg"
            onPress={() => router.push("/(auth)/verification")}
          >
            <Text className="text-white font-medium text-center">
              Verifikasi Sekarang
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView className="flex-1 mb-24" showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Aksi Cepat
          </Text>
          <View className="flex-row justify-between">
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                className={`${action.bgColor} p-4 rounded-xl w-[31%]`}
                onPress={() => router.push(action.route as any)}
              >
                <View className="items-center">
                  {action.icon}
                  <Text className="text-white text-center mt-2 text-xs">
                    {action.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Menu Cards */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Menu Utama
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {menuCards.map((card, index) => (
              <Pressable
                key={index}
                className="bg-white w-[48%] p-4 rounded-xl mb-4 shadow-sm border border-gray-100"
                onPress={() => router.push(card.route as any)}
              >
                <View className={`${card.bgColor} w-12 h-12 rounded-full items-center justify-center mb-3`}>
                  {card.icon}
                </View>
                <Text className="text-gray-800 font-bold text-lg mb-1">
                  {card.title}
                </Text>
                <Text className="text-gray-500 text-sm mb-2">
                  {card.description}
                </Text>
                <Text className="text-blue-600 text-sm font-medium">
                  {card.count}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-2 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Transaksi Terakhir
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {[1, 2, 3].map((_, index) => (
              <View 
                key={index}
                className={`flex-row items-center justify-between py-3 ${
                  index !== 2 ? "border-b border-gray-100" : ""
                }`}
              >
                <View className="flex-row items-center">
                  <View className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center mr-3">
                    <AntDesign name="shoppingcart" size={20} color="#2563eb" />
                  </View>
                  <View>
                    <Text className="text-gray-800 font-medium">INV/2024/001{index}</Text>
                    <Text className="text-gray-500 text-sm">2 menit yang lalu</Text>
                  </View>
                </View>
                <Text className="text-blue-600 font-medium">Rp 150.000</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
