import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

type Variant = "solid" | "outline" | "clear";
type IconPosition = "left" | "right";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  buttonStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  variant?: Variant;
  TouchableComponent?: any;
};

export default function AppButton({
  title,
  onPress,
  disabled,
  loading,
  icon,
  iconPosition = "left",
  buttonStyle,
  containerStyle,
  titleStyle,
  variant = "solid",
  TouchableComponent,
}: AppButtonProps) {
  const Wrapper = TouchableComponent || Pressable;

  return (
    <View style={styles.container}>
      <Wrapper
        style={({ pressed }: any) => [
          containerStyle,
          variant === "solid" && styles.solid,
          variant === "outline" && styles.outline,
          variant === "clear" && styles.clear,
          buttonStyle,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color={variant === "solid" ? "#fff" : "#000"} />
          ) : (
            <>
              {icon && iconPosition === "left" && (
                <View style={styles.iconLeft}>{icon}</View>
              )}
              <Text
                style={[
                  styles.text,
                  variant === "solid" && styles.textSolid,
                  variant === "outline" && styles.textOutline,
                  variant === "clear" && styles.textClear,
                  titleStyle,
                ]}
              >
                {title}
              </Text>
              {icon && iconPosition === "right" && (
                <View style={styles.iconRight}>{icon}</View>
              )}
            </>
          )}
        </View>
      </Wrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  solid: {
    backgroundColor: "#4285F4",
  },
  outline: {
    borderWidth: 1,
    borderColor: "#4285F4",
    backgroundColor: "transparent",
  },
  clear: {
    backgroundColor: "transparent",
  },
  disabled: {
    backgroundColor: "#ccc",
    borderColor: "#ccc",
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  textSolid: {
    color: "#fff",
  },
  textOutline: {
    color: "#4285F4",
  },
  textClear: {
    color: "#4285F4",
  },
});
