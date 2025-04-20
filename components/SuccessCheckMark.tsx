import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolateColor,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const NUM_RINGS = 3;
const RING_DELAY = 1000;

const SuccessCheckmark = () => {
  const innerColorProgress = useSharedValue(0);
  const checkmarkOpacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0.5);

  const ringAnimations = Array.from({ length: NUM_RINGS }, (_, i) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    useEffect(() => {
      scale.value = withDelay(
        i * RING_DELAY,
        withRepeat(
          withTiming(2, {
            duration: 2000,
            easing: Easing.out(Easing.exp),
          }),
          -1,
          false
        )
      );
      opacity.value = withDelay(
        i * RING_DELAY,
        withRepeat(
          withTiming(0, { duration: 2000 }),
          -1,
          false
        )
      );
    }, []);

    const style = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor: 'rgba(76, 217, 100, 0.3)',
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE / 2,
    }));

    return style;
  });

  useEffect(() => {
    innerColorProgress.value = withTiming(1, { duration: 1500 });
    checkmarkOpacity.value = withDelay(1000, withTiming(1, { duration: 600 }));
    checkmarkScale.value = withDelay(1000, withTiming(1, { duration: 600 }));
  }, []);

  const innerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      innerColorProgress.value,
      [0, 1],
      ['#115f2d', '#4cd964']
    );
    return { backgroundColor };
  });

  const checkmarkStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkScale.value }],
  }));

  return (
    <View style={styles.container}>
      {ringAnimations.map((style, index) => (
        <Animated.View key={index} style={style} />
      ))}
      <Animated.View style={[styles.innerCircle, innerStyle]}>
        <Animated.View style={[checkmarkStyle]}>
          <Svg width={46} height={46} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17L4 12"
              stroke="white"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const SIZE = 130;

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  innerCircle: {
    width: 100, // Increased size
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4cd964',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default SuccessCheckmark;
