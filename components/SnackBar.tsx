import React, { createContext, useContext, useState } from 'react';
import { IconButton, Snackbar } from 'react-native-paper';
import { ReactNode } from 'react';
import { View, Text } from 'react-native';

const SnackbarContext = createContext({
    showSnackbar: (msg: string, msgType: 'success' | 'warning' | 'error') => { },
    hideSnackbar: () => { },
});

interface SnackbarProviderProps {
    children: ReactNode;
}

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'warning' | 'error'>('success');

    const showSnackbar = (msg: string, msgType: 'success' | 'warning' | 'error' = 'success') => {
        setMessage(msg);
        setType(msgType);
        setVisible(true);
    };

    const hideSnackbar = () => setVisible(false);

    // Snackbar styling based on the type
    const getSnackbarStyle = () => {
        switch (type) {
            case 'success':
                return { backgroundColor: '#DFFFD6', borderLeftWidth: 5, borderLeftColor: '#4CAF50' };
            case 'warning':
                return { backgroundColor: '#FFF7E3', borderLeftWidth: 5, borderLeftColor: '#FFC107' };
            case 'error':
                return { backgroundColor: '#FFEBEB', borderLeftWidth: 5, borderLeftColor: '#F44336' };
            default:
                return { backgroundColor: '#FFFFFF' };
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            default:
                return null;
        }
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
            {children}
            <Snackbar
                visible={visible}
                onDismiss={hideSnackbar}
                duration={5000}
                style={{
                    ...getSnackbarStyle(),
                    bottom: 20,
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 8,
                    paddingHorizontal: 5,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>{getIcon()}</Text>
                    <Text style={{ fontSize: 16, color: '#333' }}>{message}</Text>
                    <IconButton
                        icon="close"
                        size={12}
                        iconColor='#fff'
                        onPress={hideSnackbar}
                        style={{ position: 'absolute', right: -40, top: -30, backgroundColor: 'gray' }}
                    />
                </View>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => useContext(SnackbarContext);
