import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

const Loader = () => {
    return (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    )
}

const styles = StyleSheet.create({
    loader: {
        width: '100%',
        height: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})



export default Loader