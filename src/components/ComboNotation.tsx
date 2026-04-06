import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';
import { parseCombo, ComboToken } from '../combo/parser';
import { colors } from '../theme';

interface Props {
  notation: string;
  wrap?: boolean;
}

export function ComboNotation({ notation, wrap = false }: Props) {
  const tokens = parseCombo(notation);

  if (wrap) {
    return (
      <View style={styles.wrapContainer}>
        {tokens.map((token, i) => (
          <TokenView key={i} token={token} />
        ))}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {tokens.map((token, i) => (
        <TokenView key={i} token={token} />
      ))}
    </ScrollView>
  );
}

function TokenView({ token }: { token: ComboToken }) {
  if (token.type === 'icon' && token.icon) {
    return <Image source={token.icon} style={styles.icon} resizeMode="contain" />;
  }

  const isSmallText = token.value === 'j.' || token.value === 'dl.' || token.value === '~';
  const isSeparator = token.value.trim() === '>';

  return (
    <Text
      style={[
        styles.text,
        isSmallText && styles.smallText,
        isSeparator && styles.separator,
      ]}
    >
      {token.value}
    </Text>
  );
}

const ICON_SIZE = 28;

const styles = StyleSheet.create({
  scroll: {
    marginVertical: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginVertical: 6,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginHorizontal: 1,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 1,
  },
  smallText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    marginRight: 0,
  },
  separator: {
    color: colors.textSecondary,
    fontSize: 16,
    marginHorizontal: 4,
  },
});
