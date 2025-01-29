import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
import { useState, useRef } from 'react';
import { AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { logout } from '@/utils/Pocketbase';

const { width } = Dimensions.get('window');

type MenuItem = {
  title: string;
  icon: string;
  route: string; 
}

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? -width : 0;
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8
    }).start();
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Kasir',
      icon: 'cash-register',
      route: '/(dashboard)'
    },
    {
      title: 'Riwayat Transaksi',
      icon: 'history',
      route: '/(dashboard)/history'
    },
    {
      title: 'Laporan',
      icon: 'chart-line',
      route: '/(dashboard)/reports'
    },
    {
      title: 'Kelola Toko',
      icon: 'store',
      route: '/(dashboard)/store'
    },
    {
      title: 'Akun',
      icon: 'user',
      route: '/(dashboard)/profile'
    },
    {
      title: 'Bantuan',
      icon: 'life-ring',
      route: '/(dashboard)/support'
    }
  ];

  return (
    <>
      {/* Hamburger Button */}
      <Pressable 
        onPress={toggleMenu}
        className="absolute top-12 left-4 z-50 p-2 bg-blue-600 rounded-xl shadow-lg"
      >
        <AntDesign name={isOpen ? "close" : "menuunfold"} size={24} color="white" />
      </Pressable>

      {/* Overlay */}
      {isOpen && (
        <Pressable 
          onPress={toggleMenu}
          className="absolute inset-0 bg-black/20"
        />
      )}

      {/* Sidebar Menu */}
      <Animated.View 
        style={{ 
          transform: [{ translateX: slideAnim }],
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: width * 0.75,
          zIndex: 50
        }}
        className="bg-blue-600"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-1 mt-4">
          <View className="flex-row items-center">
            <FontAwesome5 name="shield-alt" size={24} color="white" />
            <Text className="ml-2 text-lg font-semibold text-white">KasirHub</Text>
          </View>
          <View className="bg-white px-2 py-1 rounded">
            <Text className="text-blue-600 text-xs font-semibold">LITE</Text>
          </View>
        </View>

        {/* Store Section */}
        <View className="px-4 mb-2">
          <Text className="text-2xl font-bold text-white">Nama Toko</Text>
          <View className="mt-2 bg-blue-700 rounded p-2">
            <Text className="text-white">Cabang 1</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="flex-1 px-4">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                router.push(item.route as any);
                toggleMenu();
              }}
              className="flex-row items-center mb-4"
            >
              <FontAwesome5 name={item.icon} size={20} color="white" />
              <Text className="ml-4 text-white">
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Footer */}
        <View className="mt-2 px-4 pb-6">
          <View className="flex-row items-center mb-4">
            <FontAwesome5 name="sync-alt" size={20} color="white" />
            <View className="ml-4">
              <Text className="text-sm text-white">Login Terakhir:</Text>
              <Text className="text-xs text-white/80">
                Senin, 01 Juli 2023 (12:00)
              </Text>
            </View>
          </View>
          <Pressable 
            className="bg-white py-2 rounded"
          >
            <Text className="text-blue-600 text-center font-semibold">
              UPGRADE KE PREMIUM
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}
