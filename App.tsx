// App.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { theme } from './src/theme';
import { Display } from './src/components/Display';
import { Keypad } from './src/components/Keypad';
import { InputModal } from './src/components/InputModal';
import { evaluateExpression } from './src/mathEngine';

export default function App() {
  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
    Orbitron_700Bold,
  });

  // State management
  const [mode, setMode] = useState<'basic' | 'scientific'>('basic');
  const [expression, setExpression] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [livePreview, setLivePreview] = useState<string>('');
  const [activeModal, setActiveModal] = useState<'nPr' | 'nCr' | 'STAT' | null>(null);

  // Compute live preview whenever expression changes
  useEffect(() => {
    if (expression.length === 0) {
      setLivePreview('');
      return;
    }
    const exprString = expression.join('');
    const preview = evaluateExpression(exprString, true); // liveMode = true (auto-closes parentheses)
    if (preview === 'Error') {
      setLivePreview('');
    } else {
      setLivePreview(preview);
    }
  }, [expression]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accentCyan} />
      </View>
    );
  }

  const handleButtonPress = (value: string) => {
    // Recovery scenario: if currently in Error, any key press recovers
    if (result === 'Error') {
      setResult('');
      setExpression([]);
      setIsEvaluated(false);
      setLivePreview('');
      if (value === 'AC') {
        return;
      }
    }

    if (value === 'AC') {
      setExpression([]);
      setResult('');
      setIsEvaluated(false);
      setLivePreview('');
      return;
    }

    if (value === 'DEL') {
      if (isEvaluated) {
        setIsEvaluated(false);
        return;
      }
      setExpression((prev) => {
        const next = [...prev];
        next.pop();
        return next;
      });
      return;
    }

    if (value === '=') {
      const exprString = expression.join('');
      const evalRes = evaluateExpression(exprString, false); // liveMode = false
      setResult(evalRes);
      setIsEvaluated(true);
      return;
    }

    // Modal key values trigger modal display
    if (value === 'nPr' || value === 'nCr' || value === 'STAT') {
      setActiveModal(value);
      return;
    }

    const isOperator = ['+', '-', '*', '/', '^', '!', '²'].includes(value);

    if (isEvaluated) {
      if (isOperator) {
        // Scenario 4: continues from result
        setExpression([result, value]);
      } else {
        // Scenario 5: clears and starts fresh
        setExpression([value]);
      }
      setResult('');
      setIsEvaluated(false);
      return;
    }

    setExpression((prev) => [...prev, value]);
  };

  const handleInsertValueFromModal = (value: string) => {
    // Inserts computed value from modal to the end of the expression
    if (isEvaluated) {
      setExpression([value]);
      setResult('');
      setIsEvaluated(false);
    } else {
      setExpression((prev) => [...prev, value]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Display Component */}
        <Display
          expression={expression}
          result={result}
          isEvaluated={isEvaluated}
          livePreview={livePreview}
        />

        {/* Dynamic spacer to push keypad down */}
        <View style={styles.spacer} />

        {/* Keypad Component */}
        <Keypad
          mode={mode}
          setMode={setMode}
          onButtonPress={handleButtonPress}
        />

        {/* Modals for Permutation/Combination/Statistics */}
        <InputModal
          visible={activeModal !== null}
          mode={activeModal}
          onClose={() => setActiveModal(null)}
          onInsertValue={handleInsertValueFromModal}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
});
