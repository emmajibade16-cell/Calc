// src/components/Keypad.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { CalcButton } from './CalcButton';
import { BASIC_KEYS, SCI_KEYS, KeyConfig } from '../keyLayouts';

interface KeypadProps {
  mode: 'basic' | 'scientific';
  setMode: (mode: 'basic' | 'scientific') => void;
  onButtonPress: (value: string) => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  mode,
  setMode,
  onButtonPress,
}) => {
  const isSci = mode === 'scientific';

  return (
    <View style={styles.container}>
      {/* Segmented Controller (Mode Switcher) */}
      <View style={styles.modeSwitcher}>
        <Pressable
          style={[
            styles.modeTab,
            !isSci ? styles.activeTabCyan : styles.inactiveTab,
          ]}
          onPress={() => setMode('basic')}
        >
          <Text
            style={[
              styles.tabText,
              !isSci ? styles.activeTextCyan : styles.inactiveText,
            ]}
          >
            BASIC
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.modeTab,
            isSci ? styles.activeTabMagenta : styles.inactiveTab,
          ]}
          onPress={() => setMode('scientific')}
        >
          <Text
            style={[
              styles.tabText,
              isSci ? styles.activeTextMagenta : styles.inactiveText,
            ]}
          >
            SCIENTIFIC
          </Text>
        </Pressable>
      </View>

      {/* Button Grid Wrapper */}
      <View style={styles.grid}>
        {/* If Scientific mode, render scientific keys above basic keys (Top-heavy) */}
        {isSci && (
          <View style={styles.sciGrid}>
            {SCI_KEYS.map((row, rowIndex) => (
              <View key={`sci-row-${rowIndex}`} style={styles.row}>
                {row.map((item, itemIndex) => (
                  <CalcButton
                    key={`sci-btn-${rowIndex}-${itemIndex}`}
                    item={item}
                    onPress={onButtonPress}
                    isSciMode={isSci}
                  />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Basic keys are always rendered (below scientific keys in sci mode) */}
        <View style={styles.basicGrid}>
          {BASIC_KEYS.map((row, rowIndex) => (
            <View key={`basic-row-${rowIndex}`} style={styles.row}>
              {row.map((item, itemIndex) => (
                <CalcButton
                  key={`basic-btn-${rowIndex}-${itemIndex}`}
                  item={item}
                  onPress={onButtonPress}
                  isSciMode={isSci}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingBottom: 25,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#12121E',
    borderRadius: 25,
    marginHorizontal: 10,
    marginVertical: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1D1D2C',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabCyan: {
    backgroundColor: '#0D2B35',
    borderWidth: 1,
    borderColor: theme.colors.accentCyan,
  },
  activeTabMagenta: {
    backgroundColor: '#2B122A',
    borderWidth: 1,
    borderColor: theme.colors.accentMagenta,
  },
  inactiveTab: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
  activeTextCyan: {
    color: theme.colors.accentCyan,
    textShadowColor: 'rgba(0, 240, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  activeTextMagenta: {
    color: theme.colors.accentMagenta,
    textShadowColor: 'rgba(255, 0, 85, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  inactiveText: {
    color: theme.colors.textMuted,
  },
  grid: {
    marginTop: 5,
  },
  sciGrid: {
    marginBottom: 5,
  },
  basicGrid: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 1,
  },
});
