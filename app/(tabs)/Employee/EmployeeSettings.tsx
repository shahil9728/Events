import React from 'react';
import { View, Alert, StyleSheet, BackHandler, Image, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { supabase } from '../../../lib/supabase';
import { Text } from '@rneui/themed'
import { NavigationProps } from '../../RootLayoutHelpers';

const EmployeeSettings = ({ navigation }: NavigationProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: 'https://via.placeholder.com/150',
                    }}
                    style={styles.profileImage}
                />
            </View>
            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('EmployeeProfile')}
                >
                    <Text style={styles.menuText}>Your Profile</Text>
                    <Icon name="chevron-right" size={20} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Settings</Text>
                    <Icon name="chevron-right" size={20} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.menuItem, {
                        backgroundColor: '#EBFF57', justifyContent: "center"
                    }]}
                    onPress={() => supabase.auth.signOut()}
                >
                    <Text style={[styles.menuText, { color: "#202023", fontWeight: 500 }]}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    menuContainer: {
        width: '100%',
        height: "100%",
        marginTop: 10,
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: '#343436',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
    }
});

export default EmployeeSettings;
