import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Alert } from 'react-native';
import { useCallback } from 'react';

export default function useExitAppOnBackPress() {
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert('Exit App', 'Do you want to exit the app?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    );
}
