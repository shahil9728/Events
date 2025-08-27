import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Text } from 'react-native'
import { ManagerHeaderScreenProps } from '@/app/RootLayoutHelpers';
import ProfileImage from '@/components/ProfileImage';
import { useSelector } from 'react-redux';
import { useTheme } from '@/app/ThemeContext';
import CustomMenu from '@/components/CustomMenu';

const ManagerSettings = ({ navigation }: ManagerHeaderScreenProps) => {

    const accountInfo = useSelector((store: any) => store.accountInfo);
    const { theme } = useTheme();
    const styles = useStyles(theme);


    const menuItems = [
        {
            label: 'Your Profile',
            onPress: () => navigation.navigate('ManagerProfile'),
        },
    ];



    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ProfileImage profileUrl={""} name={accountInfo.name} editable={false} />
            </View>
            <CustomMenu menuItems={menuItems} />
            <TouchableOpacity
                style={styles.menuItem}
                onPress={async () => {
                    await supabase.auth.signOut(); 
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Auth' }],
                    });
                }}
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
        backgroundColor: '#060605',
    },
    imageContainer: {
        marginTop: 20,
        marginBottom: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
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
    }
});

export default ManagerSettings;
