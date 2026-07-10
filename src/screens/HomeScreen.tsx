import { FontAwesome5 } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { BrandHeader } from '../components/BrandHeader';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

export function HomeScreen() {
  return (
    <View style={styles.screen}>
      <BrandHeader />

      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <FontAwesome5 name="shield-alt" size={24} color={colors.primary} />
        </View>
        <Text style={styles.title}>PawDigi Home</Text>
        <Text style={styles.subtitle}>Your pet profile setup is complete.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16
  },
  card: {
    marginTop: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 22,
    alignItems: 'center'
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DDF7F7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 16,
    color: colors.ink,
    fontSize: 24,
    fontFamily: fontFamily.black
  },
  subtitle: {
    marginTop: 8,
    color: colors.body,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: fontFamily.regular
  }
});
