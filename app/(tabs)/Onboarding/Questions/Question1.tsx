import { useTheme } from '@/app/ThemeContext'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const Question1 = ({ answer, setAnswer }: { answer: number, setAnswer: (value: number) => void }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>How much would you rate yourself in English?</Text>
            <View style={styles.optionsContainer}>
                {[...Array(5).keys()].map(i => (
                    <TouchableOpacity
                        key={i + 1}
                        style={[
                            styles.option,
                            answer === i + 1 && { backgroundColor: theme.primaryColor }
                        ]}
                        onPress={() => setAnswer(i + 1)}
                    >
                        <Text style={[
                            styles.optionText,
                            answer === i + 1 && { color: theme.blackColor }
                        ]}>
                            {i + 1}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    option: {
        padding: 15,
        borderRadius: 50,
        backgroundColor: theme.lightGray1,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        color: theme.secondaryColor,
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default Question1