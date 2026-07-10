import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

import { ActionButton } from '../components/ActionButton';
import { FeatureCard } from '../components/FeatureCard';
import { TrustIcon } from '../components/TrustIcon';
import { features, trustItems } from '../data/onboarding';
import { assets } from '../theme/assets';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

type WelcomeScreenProps = {
  onLoginPress: () => void;
};

export function WelcomeScreen({ onLoginPress }: WelcomeScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<ScrollView>(null);
  const { height } = useWindowDimensions();
  const screenWidth = Dimensions.get('window').width;
  const pageWidth = Math.min(screenWidth - 52, 430);
  const isCompact = height < 760;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % features.length;
        carouselRef.current?.scrollTo({
          x: nextIndex * pageWidth,
          animated: true
        });
        return nextIndex;
      });
    }, 2600);

    return () => clearInterval(timer);
  }, [pageWidth]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(x / pageWidth));
  };

  return (
    <View style={[styles.screen, isCompact && styles.compactScreen]}>
      <View style={styles.hero}>
        <View style={[styles.appIconCard, isCompact && styles.compactAppIconCard]}>
          <Image source={assets.logo} style={[styles.appIcon, isCompact && styles.compactAppIcon]} resizeMode="contain" />
        </View>
        <Text style={[styles.brandName, isCompact && styles.compactBrandName]}>PawDigi</Text>
        <Text style={[styles.headline, isCompact && styles.compactHeadline]}>
          Your pet's health,{'\n'}
          <Text style={styles.headlineAccent}>digitized.</Text>
        </Text>
        <Text style={[styles.subhead, isCompact && styles.compactSubhead]}>
          Professional grade medical records and digital passports for your best friend. Secure, verified, and always accessible.
        </Text>
      </View>

      <View style={[styles.actionStack, isCompact && styles.compactActionStack]}>
        <ActionButton label="Get Started" variant="primary" onPress={onLoginPress} />
        <ActionButton label="Log In" variant="secondary" onPress={onLoginPress} />
      </View>

      <View style={styles.bottomContent}>
        <View style={[styles.carouselWrap, isCompact && styles.compactCarouselWrap]}>
          <ScrollView
            ref={carouselRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={pageWidth}
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
          >
            {features.map((feature) => (
              <View key={feature.title} style={[styles.featurePage, { width: pageWidth }]}>
                <FeatureCard feature={feature} />
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.trustDivider, isCompact && styles.compactTrustDivider]} />
        <Text style={[styles.trustedHeading, isCompact && styles.compactTrustedHeading]}>
          TRUSTED BY VETERINARY PROFESSIONALS WORLDWIDE
        </Text>
        <View style={[styles.trustRow, isCompact && styles.compactTrustRow]}>
          {trustItems.map((item) => (
            <View key={item.label} style={styles.trustItem}>
              <TrustIcon name={item.icon} size={13} />
              <Text style={styles.trustText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 12
  },
  compactScreen: {
    paddingTop: 10,
    paddingBottom: 8
  },
  hero: {
    alignItems: 'center',
    width: '100%'
  },
  appIconCard: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6
  },
  compactAppIconCard: {
    width: 72,
    height: 72,
    borderRadius: 18
  },
  appIcon: {
    width: 67,
    height: 67
  },
  compactAppIcon: {
    width: 56,
    height: 56
  },
  brandName: {
    marginTop: 14,
    color: colors.primary,
    fontSize: 24,
    fontFamily: fontFamily.extraBold
  },
  compactBrandName: {
    marginTop: 10,
    fontSize: 21
  },
  headline: {
    marginTop: 22,
    color: colors.ink,
    fontSize: 29,
    lineHeight: 35,
    fontFamily: fontFamily.black,
    textAlign: 'center'
  },
  compactHeadline: {
    marginTop: 14,
    fontSize: 25,
    lineHeight: 30
  },
  headlineAccent: {
    color: colors.primary
  },
  subhead: {
    marginTop: 14,
    maxWidth: 430,
    color: colors.body,
    fontSize: 15,
    fontFamily: fontFamily.regular,
    lineHeight: 22,
    textAlign: 'center'
  },
  compactSubhead: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18
  },
  actionStack: {
    width: '100%',
    marginTop: 20,
    gap: 10
  },
  compactActionStack: {
    marginTop: 12,
    gap: 8
  },
  bottomContent: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: 20
  },
  carouselWrap: {
    width: '100%',
    alignItems: 'center'
  },
  compactCarouselWrap: {
    marginTop: 0
  },
  featurePage: {
    paddingHorizontal: 0
  },
  trustDivider: {
    width: '100%',
    height: 1,
    marginTop: 18,
    backgroundColor: '#D7E1E3'
  },
  compactTrustDivider: {
    marginTop: 12
  },
  trustedHeading: {
    marginTop: 14,
    color: '#6F7D80',
    fontSize: 11,
    fontFamily: fontFamily.bold,
    letterSpacing: 0.9,
    textAlign: 'center'
  },
  compactTrustedHeading: {
    marginTop: 10,
    fontSize: 10,
    letterSpacing: 0.7
  },
  trustRow: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14
  },
  compactTrustRow: {
    marginTop: 10,
    gap: 10
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  trustText: {
    color: colors.trust,
    fontSize: 13,
    fontFamily: fontFamily.bold
  }
});
