// src/components/Display.tsx
import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { formatExpression } from '../mathEngine';

interface DisplayProps {
  expression: string[];
  result: string;
  isEvaluated: boolean;
  livePreview: string;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  result,
  isEvaluated,
  livePreview,
}) => {
  const exprScrollViewRef = useRef<ScrollView>(null);
  const resultScrollViewRef = useRef<ScrollView>(null);

  // Prettify the expression display
  const displayExpr = formatExpression(expression);

  // Determine what to show on the result line
  let displayResult = '0';
  let isMuted = true;

  if (isEvaluated) {
    displayResult = result;
    isMuted = false;
  } else {
    displayResult = livePreview || (expression.length === 0 ? '0' : '');
    isMuted = true;
  }

  // Auto-scroll scrollviews to the end when text changes
  const handleExprContentSizeChange = () => {
    exprScrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleResultContentSizeChange = () => {
    resultScrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Expression line */}
      <View style={styles.exprWrapper}>
        <ScrollView
          ref={exprScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={handleExprContentSizeChange}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.exprText}>
            {displayExpr || ' '}
          </Text>
        </ScrollView>
      </View>

      {/* Result/Live-preview line */}
      <View style={styles.resultWrapper}>
        <ScrollView
          ref={resultScrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={handleResultContentSizeChange}
          contentContainerStyle={styles.scrollContent}
        >
          <Text
            style={[
              styles.resultText,
              isMuted ? styles.resultMuted : styles.resultActive,
            ]}
          >
            {displayResult}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A2A',
  },
  exprWrapper: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 5,
  },
  resultWrapper: {
    height: 70,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  exprText: {
    color: theme.colors.textMuted,
    fontSize: 22,
    fontFamily: theme.fonts.regular,
    textAlign: 'right',
  },
  resultText: {
    fontSize: 44,
    fontFamily: theme.fonts.bold,
    textAlign: 'right',
  },
  resultActive: {
    color: theme.colors.accentCyan,
    textShadowColor: 'rgba(0, 240, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  resultMuted: {
    color: '#3A3A4A',
  },
});
