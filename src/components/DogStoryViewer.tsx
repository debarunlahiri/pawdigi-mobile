import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';

import { fontFamily } from '../theme/typography';

const stories = [
  { image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85', caption: 'Morning walks are the best way to start the day 🐾' },
  { image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=900&q=85', caption: 'Adventure mode: ON' },
  { image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=85', caption: 'Healthy, happy, and passport ready!' }
];

export function DogStoryViewer({ visible, dogName, avatarUri, onClose }: { visible: boolean; dogName: string; avatarUri?: string; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) { setIndex(0); progress.setValue(0); return; }
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: 5000, useNativeDriver: false });
    animation.start(({ finished }) => {
      if (!finished) return;
      if (index < stories.length - 1) setIndex((current) => current + 1); else onClose();
    });
    return () => animation.stop();
  }, [index, onClose, progress, visible]);

  const previous = () => { if (index > 0) setIndex(index - 1); else progress.setValue(0); };
  const next = () => { if (index < stories.length - 1) setIndex(index + 1); else onClose(); };

  return (
    <Modal visible={visible} animationType="fade" presentationStyle="fullScreen" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.screen}>
        <Image source={{ uri: stories[index].image }} style={styles.storyImage} />
        <View style={styles.scrim} />
        <View style={styles.top}>
          <View style={styles.progressRow}>{stories.map((_, itemIndex) => <View key={itemIndex} style={styles.track}>{itemIndex < index ? <View style={styles.completed} /> : itemIndex === index ? <Animated.View style={[styles.completed, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} /> : null}</View>)}</View>
          <View style={styles.profileRow}><Image source={{ uri: avatarUri || stories[0].image }} style={styles.avatar} /><Text style={styles.name}>{dogName || 'My Story'}</Text><Text style={styles.time}>now</Text><Pressable style={styles.close} onPress={onClose}><FontAwesome5 name="times" size={20} color="#FFFFFF" /></Pressable></View>
        </View>
        <View style={styles.touchRow}><Pressable style={styles.touchZone} onPress={previous} /><Pressable style={styles.touchZone} onPress={next} /></View>
        <View style={styles.captionWrap}><Text style={styles.caption}>{stories[index].caption}</Text><Text style={styles.credit}>Photo from Unsplash</Text></View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' }, storyImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', resizeMode: 'cover' }, scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.12)' }, top: { paddingTop: 14, paddingHorizontal: 10 }, progressRow: { flexDirection: 'row', gap: 4 }, track: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' }, completed: { height: '100%', width: '100%', backgroundColor: '#FFFFFF' },
  profileRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center' }, avatar: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, borderColor: '#FFFFFF' }, name: { marginLeft: 9, color: '#FFFFFF', fontFamily: fontFamily.bold, fontSize: 13 }, time: { marginLeft: 7, color: 'rgba(255,255,255,0.75)', fontFamily: fontFamily.regular, fontSize: 10 }, close: { marginLeft: 'auto', width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }, touchRow: { ...StyleSheet.absoluteFillObject, top: 75, flexDirection: 'row' }, touchZone: { flex: 1 }, captionWrap: { position: 'absolute', left: 20, right: 20, bottom: 50, alignItems: 'center' }, caption: { color: '#FFFFFF', fontFamily: fontFamily.bold, fontSize: 18, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 5 }, credit: { marginTop: 9, color: 'rgba(255,255,255,0.75)', fontFamily: fontFamily.regular, fontSize: 9 }
});
