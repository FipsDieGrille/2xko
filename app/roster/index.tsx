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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { characters, Character } from '../../src/characters';
import { colors } from '../../src/theme';

const CIRCLE_SIZE = 140;
const GAP = 12;  // space between circles, separator sits centered here
const ITEM_SIZE = CIRCLE_SIZE + GAP;
const N = characters.length;

const data: Character[] = [...characters, ...characters, ...characters];

let lastIndex = 0;

export default function RosterScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { width: screenWidth } = useWindowDimensions();
  const paddingHorizontal = (screenWidth - CIRCLE_SIZE) / 2;

  const scrollX = useRef(new Animated.Value((N + lastIndex) * ITEM_SIZE)).current;
  const flatListRef = useRef<Animated.FlatList<Character>>(null);
  const [currentIndex, setCurrentIndex] = useState(lastIndex);

  const onLayout = useCallback(() => {
    flatListRef.current?.scrollToIndex({ index: N + lastIndex, animated: false });
  }, []);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / ITEM_SIZE);
      const wrapped = index % N;
      setCurrentIndex(wrapped);
      lastIndex = wrapped;

      if (index < N) {
        flatListRef.current?.scrollToIndex({ index: index + N, animated: false });
      } else if (index >= N * 2) {
        flatListRef.current?.scrollToIndex({ index: index - N, animated: false });
      }
    },
    [],
  );

  const handleSelect = useCallback(() => {
    lastIndex = currentIndex;
    const characterId = characters[currentIndex].id;
    if (mode === 'framedata') {
      router.push({ pathname: '/framedata/[characterId]', params: { characterId } });
    } else {
      router.push({ pathname: '/combos/[characterId]', params: { characterId } });
    }
  }, [currentIndex, router, mode]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>{`Choose your\nChampion:`}</Text>
      <Animated.FlatList
        ref={flatListRef}
        style={{ flexGrow: 0 }}
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
            outputRange: [0.4, 0.62, 1, 0.62, 0.4],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.25, 0.5, 1, 0.5, 0.25],
            extrapolate: 'clamp',
          });
          const sepOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.15, 0.3, 0.5, 0.3, 0.15],
            extrapolate: 'clamp',
          });

          return (
            <View style={{ width: ITEM_SIZE }}>
              <View style={{ height: CIRCLE_SIZE, flexDirection: 'row', alignItems: 'center' }}>
                <Animated.View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE, transform: [{ scale }], opacity }}>
                  <TouchableOpacity onPress={handleSelect} activeOpacity={0.85} style={styles.circleOutline}>
                    <Image source={item.icon!} style={styles.circle} resizeMode="contain" />
                  </TouchableOpacity>
                </Animated.View>
                <Animated.Text style={[styles.sep, { width: GAP, opacity: sepOpacity }]}>✦</Animated.Text>
              </View>
              <Animated.Text style={[styles.name, { width: CIRCLE_SIZE, opacity }]} numberOfLines={1}>
                {item.name}
              </Animated.Text>
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
    justifyContent: 'center',
    paddingBottom: 60,
  },
  circleOutline: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 3,
    borderColor: colors.white,
    padding: 3,
    backgroundColor: colors.accent,
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: CIRCLE_SIZE / 2,
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  sep: {
    color: colors.accent,
    fontSize: 14,
    textAlign: 'center',
  },
  selectBtn: {
    marginHorizontal: 40,
    marginTop: 60,
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
  heading: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    color: '#cdf564',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 30,
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
