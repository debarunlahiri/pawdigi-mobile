import { StyleSheet, View } from 'react-native';

import { colors } from '../theme/colors';

type PagerDotsProps = {
  count: number;
  activeIndex: number;
};

export function PagerDots({ count, activeIndex }: PagerDotsProps) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 18
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#C4D0D3'
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary
  }
});
