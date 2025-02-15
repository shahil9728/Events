import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { useTheme } from '../../ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { useSnackbar } from '@/components/SnackBar';
import { OnBoarding1Props } from '@/app/RootLayoutHelpers';

export default function OnBoarding1({ route, navigation }: OnBoarding1Props) {
    const { email, password, name, option } = route.params;
    const [selectedOption, setSelectedOption] = useState<string | null>(option);
    const [contactNumber, setContactNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('');
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { showSnackbar } = useSnackbar();

    const roles = ['Bartender', 'Shadow', 'Logistics', 'Helpdesk'];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {selectedOption && (selectedOption === 'work' ? (
                <>
                    <Text style={styles.subheading}>Tell us more about yourself</Text>
                    <View style={styles.formContainer}>
                        <View style={styles.textInputCont}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter Number"
                                placeholderTextColor={theme.lightGray2}
                                onChangeText={(text) => setContactNumber(text)}
                                value={contactNumber}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={role}
                                onValueChange={(itemValue) => setRole(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Role" value="" />
                                {roles.map((r) => (
                                    <Picker.Item key={r} label={r} value={r} />
                                ))}
                            </Picker>
                        </View>
                        <Text style={styles.selectedSkillsBanner}>{role ? `${role} selected` : 'No role selected'}</Text>
                        <Button
                            title="Next"
                            buttonStyle={styles.primaryButton}
                            onPress={() =>
                                contactNumber && role
                                    ? showSnackbar('Form Submitted', 'success')
                                    : showSnackbar('Please complete the form', 'error')
                            }
                        />
                    </View>
                </>
            ) : (
                <View style={styles.formContainer}>
                    <Text style={styles.heading}>Hire Options</Text>
                    <Button
                        title="Create Event"
                        buttonStyle={styles.secondaryButton}
                    // onPress={() => showSnackbar('Create Event Clicked', 'info')}
                    />
                    <Button
                        title="Browse Profiles"
                        buttonStyle={styles.secondaryButton}
                    // onPress={() => showSnackbar('Browse Profiles Clicked', 'info')}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: theme.backgroundColor,
        flexGrow: 1,
        justifyContent: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
    },
    subheading: {
        fontSize: 16,
        textAlign: 'center',
        color: theme.secondaryColor,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.primaryColor,
        textAlign: 'center',
        marginBottom: 16,
    },
    textInputCont: {
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 50,
        backgroundColor: theme.lightGray1,
        width: "100%"
    },
    textInput: {
        backgroundColor: "transparent",
        width: "100%",
        borderBottomWidth: 0,
        fontSize: 16,
        color: theme.secondaryColor,
    },
    pickerContainer: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: theme.lightGray1,
        width: "100%"
    },
    picker: {
        color: theme.secondaryColor,
    },
    selectedSkillsBanner: {
        color: theme.primaryColor,
        textAlign: 'center',
        marginVertical: 10,
    },
    primaryButton: {
        backgroundColor: "transparent",
        padding: 20,
    },
    primaryButtonTitle: {
        textAlign: 'center',
        flex: 1,
    },
    secondaryButton: {
        backgroundColor: theme.secondaryColor,
        padding: 15,
        marginTop: 10,
        borderRadius: 10,
    },
});
