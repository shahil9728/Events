import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

interface AnimatedPressableProps {
    children: React.ReactNode;
    onPress: () => void;
    style?: object;
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = ({ children, onPress, style }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.97, // Shrink effect
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1, // Return to normal size
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable 
            onPress={onPress}
            onPressIn={handlePressIn} 
            onPressOut={handlePressOut}
            android_ripple={{ borderless: true, color: 'transparent' }}
        >
            <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default AnimatedPressable;
