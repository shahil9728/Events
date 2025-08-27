import { useTheme } from '@/app/ThemeContext';
import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

const Loader = () => {
    const { theme } = useTheme();
    const styles = useStyles(theme);
    return (
        <ActivityIndicator size="large" color={theme.primaryColor} style={styles.loader} />
    )
}

const useStyles = (theme: any) => StyleSheet.create({
    loader: {
        width: '100%',
        height: "100%",
        backgroundColor: theme.backgroundColor,
    },
})



export default Loader