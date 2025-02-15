import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface DropdownComponentProps {
    data: { label: string; value: string }[];
    label: string;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ data, label }) => {
    const [value, setValue] = useState<string>('');
    return (
        <View>
            <Dropdown
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={label}
                value={value}
                onChange={item => {
                    setValue(item.value);
                }}
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: '#202023',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        color: "#EBFE55",
    },
    dropdownContainer: {
        backgroundColor: '#343436',
        borderColor: "#343436",
        borderRadius: 8,
        color: "#EBFE55",
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#787975'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#ffffff',
    },
    itemTextStyle: {
        color: '#ffffff',
    }
});
