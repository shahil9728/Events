import { ICONTYPE } from '@/app/globalConstants';
import { useTheme } from '@/app/ThemeContext';
import Icon from '@/helpers/Icon';
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type IconwithContainerProps = {
    iconName?: string;
    iconColor?: string;
    onPress?: () => void;
    children?: React.ReactNode;
};


const IconwithContainer: React.FC<IconwithContainerProps> = ({ iconName = 'chevron-forward-outline', onPress, children, iconColor }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity style={styles.IconContainer} onPress={onPress}>
            {children ? children : (
                <Icon name={iconName} type={ICONTYPE.IONICON} color={iconColor ?? theme.headingColor} />
            )}
        </TouchableOpacity>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    IconContainer: {
        backgroundColor: theme.lightGray1,
        borderRadius: 50,
        width: 50,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

})

export default IconwithContainer