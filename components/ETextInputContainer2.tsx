import React, { forwardRef } from 'react';
import { useTheme } from '@/app/ThemeContext';
import { TextInput, View, StyleSheet, TextStyle } from 'react-native';

interface ETextInputContainer2Props {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
    conatinerStyle?: any;
    inputStyle?: TextStyle | TextStyle[];
    maxLength?: number;
    multiline?: boolean;
}

const ETextInputContainer2 = forwardRef<TextInput, ETextInputContainer2Props>(
    ({ placeholder, value, onChangeText, keyboardType = 'default', conatinerStyle, inputStyle, maxLength, multiline }, ref) => {
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
                    multiline={multiline}
                />
            </View>
        );
    }
);

const useStyles = (theme: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: theme.lightGray,
        color: '#ffffff',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
    },
});

export default ETextInputContainer2;
