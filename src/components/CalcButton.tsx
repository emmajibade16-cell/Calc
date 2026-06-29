// src/components/CalcButton.tsx
import React from 'react';
import { Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';
import { KeyConfig } from '../keyLayouts';

interface CalcButtonProps {
  item: KeyConfig;
  onPress: (value: string) => void;
  isSciMode: boolean;
}

const { width } = Dimensions.get('window');

export const CalcButton: React.FC<CalcButtonProps> = ({ item, onPress, isSciMode }) => {
  // Determine text and container styles based on button type
  const getButtonStyles = (pressed: boolean) => {
    const stylesList: any[] = [styles.button];

    // Shape/Border Radius
    stylesList.push({ borderRadius: theme.shapes.borderRadius });

    // Background selection
    if (item.type === 'number') {
      stylesList.push(styles.btnNumber);
    } else if (item.type === 'operator') {
      stylesList.push(styles.btnOperator);
    } else if (item.type === 'sci') {
      stylesList.push(styles.btnSci);
    } else if (item.type === 'action') {
      if (item.value === '=') {
        stylesList.push(styles.btnEqual);
      } else {
        stylesList.push(styles.btnAction);
      }
    }

    // Pressed Feedback (Neon Glow Highlight)
    if (pressed) {
      if (item.type === 'sci' || item.value === '=') {
        stylesList.push(styles.buttonPressedMagenta);
      } else {
        stylesList.push(styles.buttonPressedCyan);
      }
    }

    return stylesList;
  };

  const getTextStyle = () => {
    const textStyleList: any[] = [styles.text];

    if (item.type === 'number') {
      textStyleList.push(styles.textNumber);
    } else if (item.type === 'operator') {
      textStyleList.push(styles.textOperator);
    } else if (item.type === 'sci') {
      textStyleList.push(styles.textSci);
    } else if (item.type === 'action') {
      if (item.value === '=') {
        textStyleList.push(styles.textEqual);
      } else {
        textStyleList.push(styles.textAction);
      }
    }

    // Shrink text for longer label strings
    if (item.label.length > 4) {
      textStyleList.push({ fontSize: 13 });
    } else if (item.label.length > 3) {
      textStyleList.push({ fontSize: 16 });
    }

    return textStyleList;
  };

  // Adjust key heights dynamically. Under sci mode (10 rows), we need keys to be shorter to fit without scrolling.
  const buttonHeight = isSciMode ? 46 : 64;

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyles(pressed),
        { height: buttonHeight }
      ]}
      onPress={() => onPress(item.value)}
    >
      <Text style={getTextStyle()}>{item.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: theme.shapes.borderWidth,
    borderColor: 'transparent',
    // Elevate button slightly
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  // Specific Button Types Styling
  btnNumber: {
    backgroundColor: theme.colors.keyNumber,
    borderColor: '#1D1D2C',
  },
  btnOperator: {
    backgroundColor: theme.colors.keyOperator,
    borderColor: 'rgba(0, 240, 255, 0.15)',
  },
  btnSci: {
    backgroundColor: theme.colors.keySci,
    borderColor: 'rgba(255, 0, 85, 0.15)',
  },
  btnAction: {
    backgroundColor: theme.colors.keyBase,
    borderColor: 'rgba(255, 234, 0, 0.15)',
  },
  btnEqual: {
    backgroundColor: theme.colors.accentMagenta,
    borderColor: theme.colors.accentMagenta,
  },
  // Press Actions (Neon glow borders)
  buttonPressedCyan: {
    opacity: 0.85,
    borderColor: theme.colors.borderGlowCyan,
    shadowColor: theme.colors.borderGlowCyan,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonPressedMagenta: {
    opacity: 0.85,
    borderColor: theme.colors.borderGlowMagenta,
    shadowColor: theme.colors.borderGlowMagenta,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  // Text Styling
  text: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
  },
  textNumber: {
    color: theme.colors.text,
  },
  textOperator: {
    color: theme.colors.accentCyan,
  },
  textSci: {
    color: theme.colors.accentMagenta,
  },
  textAction: {
    color: theme.colors.accentYellow,
  },
  textEqual: {
    color: '#0A0A0F',
    fontWeight: 'bold',
  },
});
