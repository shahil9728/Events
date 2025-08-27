import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo"; 

const icons = {
  ionicon: Ionicons,
  "font-awesome": FontAwesome,
  material: MaterialIcons,
  antdesign: AntDesign,
  feather: Feather,
  entypo: Entypo,
};

export type IconProps = {
  type?: keyof typeof icons;
  name: string;
  size?: number;
  color?: string;
  [key: string]: any;
};

export default function Icon({ type = "ionicon", name, size = 24, color = "#000", ...props }: IconProps) {
  const VectorIcon = icons[type];
  if (!VectorIcon) {
    console.warn(`Icon type "${type}" not supported.`);
    return null;
  }
  return <VectorIcon name={name} size={size} color={color} {...props} />;
}
