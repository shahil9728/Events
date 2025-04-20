import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { supabase } from '../../../lib/supabase';
import { Text } from '@rneui/themed'
import { NavigationProps } from '../../RootLayoutHelpers';
import { useSelector } from 'react-redux';
import ProfileImage from '@/components/ProfileImage';
import { useTheme } from '@/app/ThemeContext';
import CustomMenu from '@/components/CustomMenu';

const EmployeeSettings = ({ navigation }: NavigationProps) => {
    const accountInfo = useSelector((store: { accountInfo: any }) => store.accountInfo);

    const { theme } = useTheme();
    const styles = useStyles(theme);

    const menuItems = [
        {
            label: 'Your Profile',
            onPress: () => navigation.navigate('EmployeeProfile'),
        },
    ];



    return (
        <View style={styles.container}>
            <ProfileImage profileUrl={accountInfo.profile_url} name={accountInfo.name} editable={false} conatinerStyle={{ marginBottom: 20 }} />
            <CustomMenu menuItems={menuItems} />
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => supabase.auth.signOut()}
            >
                <Text style={styles.menuText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const useStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    menuItem: {
        width: "100%",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#EBFF57',
        justifyContent: "center",
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        color: "#202023",
        fontWeight: 500
    },

});

export default EmployeeSettings;
