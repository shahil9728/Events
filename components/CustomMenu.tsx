import { useTheme } from '@/app/ThemeContext';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type MenuItem = {
    label: string;
    onPress: (event: GestureResponderEvent) => void;
};

type CustomMenuProps = {
    menuItems: MenuItem[];
};

const CustomMenu: React.FC<CustomMenuProps> = ({ menuItems }) => {
    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={item.onPress}
                >
                    <Text style={styles.menuText}>{item.label}</Text>
                    <Icon name="chevron-right" size={20} color="#ffffff" />
                </TouchableOpacity>
            ))}
        </View>
    );
};

const useStyles = (theme: any) => StyleSheet.create({
    menuContainer: {
        width: '100%',
        display: 'flex',
        gap: 10,
        marginTop: 15,
        marginBottom: 15,
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: theme.lightGray,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default CustomMenu;
