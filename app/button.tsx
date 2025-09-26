import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
}

export default function Button({ label, onPress }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}
