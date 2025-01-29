import { View } from "react-native";
import "../global.css";
 
export default function RoundVariation() {
  return (
    <>
      {/* Top left large circle */}
      <View className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-blue-500/20" />
      
      {/* Bottom right medium circle */}
      <View className="absolute bottom-10 right-0 w-32 h-32 rounded-full bg-blue-400/10" />
      
      {/* Middle right small circle */}
      <View className="absolute top-1/2 -right-5 w-16 h-16 rounded-full bg-blue-300/15" />
      
      {/* Bottom left tiny circle */}
      <View className="absolute bottom-20 left-5 w-8 h-8 rounded-full bg-blue-200/20" />
    </>
  );
}
