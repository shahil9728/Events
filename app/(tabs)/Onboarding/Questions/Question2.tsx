import { useTheme } from '@/app/ThemeContext'
import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
import Icon from '@/helpers/Icon';
import { languagesList } from '../onboardingConstants'

const Question2 = ({ answer: selectedLanguages, setAnswer }: { answer: string[], setAnswer: (value: string[]) => void }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [inputValue, setInputValue] = useState('');
    const [filteredLanguages, setFilteredLanguages] = useState<string[]>([]);

    const handleInputChange = (text: string) => {
        setInputValue(text);
        if (text) {
            const filtered = languagesList.filter(lang => lang.toLowerCase().includes(text.toLowerCase()) && !selectedLanguages.includes(lang));
            setFilteredLanguages(filtered);
        } else {
            setFilteredLanguages([]);
        }
    };

    const handleLanguageSelect = (language: string) => {
        setAnswer([...selectedLanguages, language]);
        setInputValue('');
        setFilteredLanguages([]);
    };

    const handleLanguageRemove = (language: string) => {
        setAnswer(selectedLanguages.filter(lang => lang !== language));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Which languages do you speak?</Text>
            <View style={styles.textInputCont}>
                <View style={styles.chipsContainer}>
                    {selectedLanguages.map((language, index) => (
                        <TouchableOpacity style={styles.chip} key={index} onPress={() => handleLanguageRemove(language)}>
                            <Text style={styles.chipText}>{language}</Text>
                            <Icon name="close" type="material" size={16} color={theme.blackColor} />
                        </TouchableOpacity>
                    ))}
                    <TextInput
                        style={styles.textInput}
                        placeholder={selectedLanguages.length ? "" : "Type to search languages"}
                        placeholderTextColor={theme.lightGray2}
                        value={inputValue}
                        onChangeText={handleInputChange}
                    />
                </View>
            </View>
            {filteredLanguages.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={filteredLanguages}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.dropdownItem} onPress={() => handleLanguageSelect(item)}>
                                <Text style={styles.dropdownItemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    heading: {
        color: theme.headingColor,
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    textInputCont: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: theme.lightGray1,
        width: "100%",
    },
    chipsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 5,
        marginBottom: 8,
    },
    chipText: {
        color: theme.backgroundColor,
        marginRight: 5,
    },
    textInput: {
        backgroundColor: "transparent",
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
        color: theme.secondaryColor,
    },
    dropdown: {
        backgroundColor: theme.lightGray1,
        borderRadius: 10,
        marginTop: 5,
        maxHeight: 150,
    },
    dropdownItem: {
        padding: 10,
    },
    dropdownItemText: {
        color: theme.secondaryColor,
    },
})

export default Question2
