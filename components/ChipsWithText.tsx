import { useTheme } from '@/app/ThemeContext';
import { Icon } from '@rneui/themed';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ChipsWithTextProps {
    icon: string;
    type?: string;
    text: string;
    alternate?: boolean;
    onPress?: () => void;
}

const ChipsWithText: React.FC<ChipsWithTextProps> = ({ icon, type, text, alternate, onPress }) => {

    const { theme } = useTheme();
    const styles = useStyles(theme)

    return (
        <TouchableOpacity
            style={[styles.iconWithText, styles.iconWithTextcont, alternate && { backgroundColor: "#343436" }]}
            onPress={onPress}
        >
            <Icon
                name={icon}
                type={type}
                size={15}
                color={alternate ? theme.headingColor : "#060605"}
            />
            <Text
                style={[styles.detailItem, alternate && { color: theme.headingColor }]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const useStyles = (theme: any) => StyleSheet.create({
    iconWithTextcont: {
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: theme.primaryColor2,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWithText: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        gap: 3,
    },
    detailItem: {
        fontSize: 14,
    },
});

export default ChipsWithText;