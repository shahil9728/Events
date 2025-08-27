import React from "react";
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from "react-native";

type AppInputProps = {
  label?: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export default function AppInput({
  label,
  value,
  placeholder,
  onChangeText,
  inputStyle,
  containerStyle,
  secureTextEntry = false,
  autoCapitalize = "sentences",
}: AppInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 16,
  },
});
