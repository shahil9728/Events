import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';

const BottomNavigation = ({ state, descriptors, navigation, activeTab }: BottomTabBarProps & { activeTab?: string }) => {
    return (
        <View style={styles.tabBarOuterContainer}>
            <View style={styles.tabBarContainer}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        typeof options.tabBarLabel === 'string'
                            ? options.tabBarLabel
                            : typeof options.title === 'string'
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const getIconName = (routeName: string) => {
                        switch (routeName) {
                            case 'Employee':
                            case 'ManagerDashboard':
                                return 'briefcase-outline';
                            case 'ManagerMyEvents':
                                return 'calendar-outline';
                            case 'ManagerChat':
                                return 'chatbox-ellipses-outline';
                            case 'ManagerSettings':
                            case 'EmployeeSettings':
                                return 'person-outline';
                            default:
                                return 'help';
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[styles.tabItem, isFocused && { flex: 2 }]}
                        >
                            <View
                                style={[
                                    styles.iconContainer,
                                    isFocused && styles.focusedIconContainer,
                                    isFocused && styles.focusedTab,
                                ]}
                            >
                                <Icon
                                    name={getIconName(route.name)}
                                    size={24}
                                    type='ionicon'
                                    color={isFocused ? 'black' : 'white'}
                                />
                                {isFocused && (
                                    <Text style={[styles.label, styles.focusedLabel]}>{label}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabBarOuterContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarContainer: {
        flexDirection: 'row',
        position: 'relative',
        width: "90%",
        height: 65,
        backgroundColor: '#000000',
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 50,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        height: 55,
        borderRadius: 50,
    },
    focusedIconContainer: {
        backgroundColor: 'white',
    },
    focusedTab: {
        padding: 10,
        width: "95%",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        color: 'black',
        marginTop: 5,
    },
    focusedLabel: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default BottomNavigation;
