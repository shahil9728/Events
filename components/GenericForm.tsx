import { useTheme } from '@/app/ThemeContext'
import { Icon } from '@rneui/themed';
import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, Keyboard } from 'react-native'
import IconwithContainer from './IconwithContainer';
import { ICONTYPE } from '@/app/globalConstants';

interface GenericFormProps {
    children: React.ReactNode;
    footerMsg?: string;
    handleNext?: () => void;
    icons: { iconName: string; active: boolean }[];
    isLoading?: boolean;
}

const GenericForm: React.FC<GenericFormProps> = ({ children, footerMsg, handleNext, icons, isLoading }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const handleClick = () =>{
        Keyboard.dismiss();
        if (handleNext) {
            handleNext();
        }
    }

    return (
        <View style={styles.container}>
            {/* Icons Row */}
            <View style={styles.iconsRow}>
                {icons.map((icon, index) => (
                    <Icon
                        key={index}
                        name={icon.iconName}
                        size={25}
                        type={ICONTYPE.MATERIAL}
                        color={icon.active ? theme.primaryColor : theme.lightGray2}
                    />
                ))}
            </View>

            {/* Main Screen */}
            {children}

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footermsg}>
                    {footerMsg}
                </Text>
                {isLoading ? (
                    <IconwithContainer>
                        <ActivityIndicator size="small" color={theme.primaryColor} />
                    </IconwithContainer>
                ) : (
                    <IconwithContainer
                        iconName='chevron-forward-outline'
                        onPress={handleClick}
                    />
                )}
            </View>
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        padding: 20,
        justifyContent: 'center',
        backgroundColor: theme.backgroundColor
    },
    iconsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginVertical: 20,
    },
    footer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footermsg: {
        color: theme.primaryColor,
        fontSize: 16,
        textAlign: 'center',
    }
})

export default GenericForm