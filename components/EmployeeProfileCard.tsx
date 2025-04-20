import React from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import ChipsWithText from './ChipsWithText'; // Assuming you have this component
import { useTheme } from '@/app/ThemeContext';
import { formatRoles } from '@/app/(tabs)/utils';
import { employeeDetails } from '@/app/(tabs)/employeeConstants';

type EmployeeProfileCardProps = {
    item: any;
    alternate: boolean;
    profileImage: string;
    loading?: boolean;
    setShowWarning?: React.Dispatch<React.SetStateAction<boolean>>;
    showActionButton?: boolean;
};

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ item, alternate, setShowWarning, loading, profileImage, showActionButton = true }) => {

    const { theme } = useTheme();
    const styles = useStyles(theme);

    return (
        <View>
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: item.profile_url || profileImage }}
                    style={styles.profileImage}
                />

                {/* <View style={styles.iconsContainer}>
        <TouchableOpacity style={[styles.iconButton, alternate && { backgroundColor: "#565555" }]}>
          <Icon name="heart" type="ionicon" size={20} color={alternate ? "#F1F0E6" : "#060605"} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, alternate && { backgroundColor: "#565555" }]}>
          <Icon name="chatbox-ellipses" type="ionicon" size={20} color={alternate ? "#F1F0E6" : "#060605"} />
        </TouchableOpacity>
      </View> */}

            </View>
            <Text style={[styles.name, alternate && { color: "#F1F0E6" }]}>{item.name}</Text>

            <View style={styles.detailsRow}>
                {employeeDetails(item.location).map(({ icon, type, text }, index) => (
                    <ChipsWithText
                        key={index}
                        icon={icon}
                        type={type}
                        text={text}
                        alternate={alternate}
                    />
                ))}
            </View>

            <View style={styles.jobRow}>
                <View style={{ width: "70%" }}>
                    <Text style={[styles.jobTitle, alternate && { color: "#A5A6A6" }]}>
                        {formatRoles(item.role)}
                    </Text>
                    <Text style={[styles.salary, alternate && { color: "#F1F0E6" }]}>
                        {item.salary} ₹
                        <Text style={[styles.perMonth, alternate && { color: "#F1F0E6" }]}>/ shift</Text>
                    </Text>
                </View>

                {showActionButton && (
                    <TouchableOpacity
                        style={[styles.actionButton, alternate && { backgroundColor: "#F1F0E6" }]}
                        onPress={() => setShowWarning && setShowWarning(true)}
                    >
                        {loading ? (
                            <ActivityIndicator size={25} color={alternate ? "#060605" : "#F1F0E6"} />
                        ) : (
                            <Text style={[styles.buttonText, alternate && { color: "#2C2B2B" }]}>Hire Now</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const useStyles = (theme: any) => StyleSheet.create({
    profileSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#5E6623',
        marginTop: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    detailItem: {
        fontSize: 14,
        color: '#202023',
    },
    jobRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#76802C',
        marginTop: 15,
    },
    salary: {
        fontSize: 22,
        color: '#202023',
        fontWeight: 'bold',
        marginTop: 5,
    },
    perMonth: {
        fontSize: 15,
        color: '#202023',
    },
    actionButtonRow: {
        height: "100%",
        flexDirection: 'row',
        alignItems: "flex-end",
    },
    actionButton: {
        backgroundColor: '#060605',
        borderRadius: 40,
        padding: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#E4F554',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default EmployeeProfileCard;
