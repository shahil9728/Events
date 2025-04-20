import GenericForm from '@/components/GenericForm'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSnackbar } from '@/components/SnackBar';
import { NavigationProps } from '@/app/RootLayoutHelpers';
import { supabase } from '@/lib/supabase';
import Question1 from './Question1';
import Question2 from './Question2';

const Questions = ({ navigation }: NavigationProps) => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [answers, setAnswers] = useState<{ question1: number, question2: string[] }>({ question1: 0, question2: [] });

    const handleNext = () => {
        if (currentScreen === 1) {
            if (answers.question1 === 0) {
                showSnackbar("Please select an option", 'error');
                return;
            }
            setCurrentScreen(2);
        }
        else if (currentScreen === 2) {
            if (answers.question2.length === 0) {
                showSnackbar("Please write at least one language", 'error');
                return;
            }
            navigation.navigate('QuestionFinal');
        }
    };

    const screenIcons = [
        { iconName: 'language', active: currentScreen === 1 },
        { iconName: 'translate', active: currentScreen === 2 }
    ];

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 80 }}>
            {currentScreen === 1 && (
                <GenericForm handleNext={handleNext} icons={screenIcons} >
                    <Question1 answer={answers.question1} setAnswer={(value: number) => setAnswers({ ...answers, question1: value })} />
                </GenericForm>
            )}
            {currentScreen === 2 && (
                <GenericForm icons={screenIcons} handleNext={handleNext}>
                    <Question2 answer={answers.question2} setAnswer={(value: string[]) => setAnswers({ ...answers, question2: value })} />
                </GenericForm>
            )}
        </View>
    )
}

export default Questions