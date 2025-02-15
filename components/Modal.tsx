import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function Modal() {
    return (
        <Animated.View
            entering={FadeIn}
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
            }}
        >
            <Link href={'/'} asChild>
                <Pressable style={StyleSheet.absoluteFill} />
            </Link>
            <Animated.View
                entering={SlideInDown}
                style={{
                    width: '90%',
                    height: '80%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    zIndex: 1000,
                }}
            >
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Modal Screen</Text>
                <Link href="/">
                    <Text>← Go back</Text>
                </Link>
            </Animated.View>
        </Animated.View>
    );
}
