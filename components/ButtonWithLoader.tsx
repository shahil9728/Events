import { useTheme } from '@/app/ThemeContext';
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useSnackbar } from './SnackBar';

interface ButtonWithLoaderProps {
    loading: boolean;
    btnText: string;
    disabled?: boolean;
    onClick: () => void;
}

const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({ disabled, loading, btnText, onClick }) => {
    const { theme } = useTheme();
    const { showSnackbar } = useSnackbar();
    // const handleClick = () => {
    //     if (disabled) {
    //         showSnackbar('Nothing to Update', 'warning');
    //     }
    //     onClick();
    // }


    return (
        <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: disabled ? theme.secondaryColor : theme.primaryColor }]}
            onPress={onClick}
        >
            {loading ? (
                <ActivityIndicator size="small" color={theme.blackColor} />
            ) : (
                <Text style={styles.updateButtonText}>{btnText}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    updateButton: {
        backgroundColor: '#B6BF48',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonText: {
        color: '#060605',
        fontSize: 16,
        fontWeight: 500,
    },
});

export default ButtonWithLoader;
