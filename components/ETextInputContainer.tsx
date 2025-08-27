import React, { forwardRef } from 'react';
import { useTheme } from '@/app/ThemeContext';
import { TextInput, View, StyleSheet, TextStyle } from 'react-native';

interface ETextInputContainerProps {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    conatinerStyle?: any;
    inputStyle?: TextStyle | TextStyle[];
    maxLength?: number;
    children?: React.ReactNode;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const ETextInputContainer = forwardRef<TextInput, ETextInputContainerProps>(
    ({ placeholder, value, onChangeText, keyboardType = 'default', conatinerStyle, inputStyle, maxLength, secureTextEntry, children, autoCapitalize }, ref) => {
        const { theme } = useTheme();
        const styles = useStyles(theme);

        return (
            <View style={[styles.container, conatinerStyle]}>
                <TextInput
                    ref={ref as any}
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={theme.lightGray2}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                />
                {children}
            </View>
        );
    }
);

const useStyles = (theme: any) => StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 50,
        backgroundColor: theme.lightGray1,
        width: "100%",
    },
    input: {
        backgroundColor: "transparent",
        width: "100%",
        fontSize: 16,
        color: theme.secondaryColor,
    },
});

export default ETextInputContainer;
