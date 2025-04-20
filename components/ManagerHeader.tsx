import { ManagerHeaderScreenProps } from '@/app/RootLayoutHelpers'
import { Icon } from '@rneui/themed'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

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
