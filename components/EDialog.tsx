import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from '@/helpers/Icon';
import { useTheme } from '@/app/ThemeContext';

interface EDialogProps {
    visible: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    icon?: string;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    children?: React.ReactNode;
}

const EDialog: React.FC<EDialogProps> = ({
    visible,
    onClose,
    onConfirm,
    icon,
    title,
    message,
    confirmText,
    cancelText,
    children,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.dialogContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            {icon && <Icon name={icon ? icon : 'warning'} type="ionicon" size={24} color={'#FF9800'} />}
                            {title && <Text style={styles.title}>{title}</Text>}
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" type="ionicon" size={20} color={theme.headingColor} />
                        </TouchableOpacity>
                    </View>

                    {children ? (
                        <View style={styles.contentContainer}>
                            {children}
                        </View>
                    ) : (
                        <View style={styles.contentContainer}>
                            <Text style={styles.message}>{message}</Text>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        {onClose && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                        {onConfirm && (
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={onConfirm}
                            >
                                <Text style={styles.confirmButtonText}>{confirmText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContainer: {
        width: Dimensions.get('window').width * 0.85,
        backgroundColor: theme.lightGray || '#2A2A2A',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.headingColor || 'white',
        flex: 1,
        marginLeft: 12,
    },
    closeButton: {
        padding: 4,
    },
    contentContainer: {
        padding: 16,
    },
    message: {
        fontSize: 16,
        color: theme.lightGray2 || '#CCCCCC',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        paddingTop: 8,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginLeft: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    confirmButton: {
        backgroundColor: theme.dangerColor || '#E53935',
    },
    cancelButtonText: {
        color: theme.lightGray2 || '#CCCCCC',
        fontWeight: '600',
        fontSize: 14,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default EDialog;