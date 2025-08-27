import { ManagerHeaderScreenProps } from '@/app/RootLayoutHelpers'
import React from 'react'
import { StyleSheet, View } from 'react-native'

const ManagerHeader = ({ navigation }: ManagerHeaderScreenProps) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}
        >
            {/* <TouchableOpacity
                onPress={() => navigation.navigate('ManagerChat')}
            >
                <Icon name="bell" type='feather' size={20} color="#F1F0E6" style={styles.icon} />
            </TouchableOpacity> */}
        </View>

    )
}

export default ManagerHeader

const styles = StyleSheet.create({
    icon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
});
