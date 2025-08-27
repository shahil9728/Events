import { EmployeeHeaderScreenProps } from '@/app/RootLayoutHelpers'
import Icon from '@/helpers/Icon';
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Modal from './Modal'

const EmployeeHeader = ({ navigation }: EmployeeHeaderScreenProps) => {
    const [visible, setvisible] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            // const { data: { user } } = await supabase.auth.getUser();
            // const { data: { request } } = await supabase.from('employee_to_manager').select("*").eq('employee_id', user?.id).single();
        };

        fetchUser();
    }, []);
    return (
        <>
            {visible && <Modal />}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('EmployeeInbox')}
                >
                    <Icon name="bell" type='feather' size={25} color="#F1F0E6" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </>
    )
}


export default EmployeeHeader


const styles = StyleSheet.create({
    icon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
    },
});
