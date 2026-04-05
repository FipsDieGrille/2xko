import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { characters, Character } from '../../src/characters';
import { colors } from '../../src/theme';

const CARD_WIDTH = 150;
const CARD_HEIGHT = 158;
const CARD_MARGIN = 8;
const SEP_WIDTH = 20;
const ITEM_SIZE = CARD_WIDTH + CARD_MARGIN * 2 + SEP_WIDTH;
const N = characters.length;

const data: Character[] = [...characters, ...characters, ...characters];

export default function RosterScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const paddingHorizontal = (screenWidth - CARD_WIDTH) / 2 - CARD_MARGIN - SEP_WIDTH / 2;

  const scrollX = useRef(new Animated.Value(N * ITEM_SIZE)).current;
  const flatListRef = useRef<Animated.FlatList<Character>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onLayout = useCallback(() => {
    flatListRef.current?.scrollToIndex({ index: N, animated: false });
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / ITEM_SIZE);
      setCurrentIndex(index % N);

      if (index < N) {
        flatListRef.current?.scrollToIndex({ index: index + N, animated: false });
      } else if (index >= N * 2) {
        flatListRef.current?.scrollToIndex({ index: index - N, animated: false });
      }
    },
    [],
  );

  const handleSelect = useCallback(() => {
    router.push({
      pathname: '/combos/[characterId]',
      params: { characterId: characters[currentIndex].id },
    });
  }, [currentIndex, router]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(c, i) => `${c.id}-${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal }}
        onLayout={onLayout}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const center = index * ITEM_SIZE;
          const inputRange = [
            center - ITEM_SIZE * 2,
            center - ITEM_SIZE,
            center,
            center + ITEM_SIZE,
            center + ITEM_SIZE * 2,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.72, 0.84, 1, 0.84, 0.72],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 0.6, 1, 0.6, 0.35],
            extrapolate: 'clamp',
          });
          const sepOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.15, 0.3, 0.5, 0.3, 0.15],
            extrapolate: 'clamp',
          });

          return (
            <View style={styles.itemRow}>
              <View style={{ width: CARD_MARGIN }} />
              <Animated.View style={{ transform: [{ scale }], opacity }}>
                <TouchableOpacity
                  style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}
                  onPress={handleSelect}
                  activeOpacity={0.85}
                >
                  {item.icon ? (
                    <Image source={item.icon} style={styles.portrait} resizeMode="cover" />
                  ) : (
                    <View style={styles.portraitPlaceholder} />
                  )}
                  <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                  {item.comingSoon && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Soon</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
              <View style={{ width: CARD_MARGIN }} />
              <Animated.Text style={[styles.sep, { opacity: sepOpacity }]}>✦</Animated.Text>
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.selectBtn} onPress={handleSelect} activeOpacity={0.8}>
        <Text style={styles.selectText}>Select</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  portrait: {
    width: '100%',
    flex: 1,
  },
  portraitPlaceholder: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  sep: {
    color: colors.accent,
    fontSize: 14,
    width: SEP_WIDTH,
    textAlign: 'center',
  },
  selectBtn: {
    marginHorizontal: 40,
    marginTop: 24,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  selectText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backText: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '600',
  },
});
