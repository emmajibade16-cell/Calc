// src/components/InputModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../theme';
import { computeNPr, computeNCr, computeStats, StatResult } from '../mathEngine';

interface InputModalProps {
  visible: boolean;
  mode: 'nPr' | 'nCr' | 'STAT' | null;
  onClose: () => void;
  onInsertValue: (value: string) => void;
}

export const InputModal: React.FC<InputModalProps> = ({
  visible,
  mode,
  onClose,
  onInsertValue,
}) => {
  // Input fields state
  const [valN, setValN] = useState('');
  const [valR, setValR] = useState('');
  const [statInput, setStatInput] = useState('');

  // Results state
  const [singleResult, setSingleResult] = useState<string | null>(null);
  const [statResult, setStatResult] = useState<StatResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Clear states when opening/closing
  useEffect(() => {
    setValN('');
    setValR('');
    setStatInput('');
    setSingleResult(null);
    setStatResult(null);
    setErrorMsg(null);
  }, [visible, mode]);

  const handleCompute = () => {
    setErrorMsg(null);
    try {
      if (mode === 'nPr' || mode === 'nCr') {
        const n = parseFloat(valN);
        const r = parseFloat(valR);

        if (isNaN(n) || isNaN(r)) {
          setErrorMsg('Please enter both n and r.');
          return;
        }

        if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
          setErrorMsg('Must be positive integers, and r <= n.');
          return;
        }

        if (mode === 'nPr') {
          const res = computeNPr(n, r);
          setSingleResult(res.toString());
        } else {
          const res = computeNCr(n, r);
          setSingleResult(res.toString());
        }
      } else if (mode === 'STAT') {
        if (!statInput.trim()) {
          setErrorMsg('Please enter some numbers.');
          return;
        }
        // Split and parse comma-separated values
        const parsed = statInput
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v !== '')
          .map((v) => parseFloat(v));

        if (parsed.length === 0 || parsed.some(isNaN)) {
          setErrorMsg('Invalid format. Enter comma-separated numbers.');
          return;
        }

        const res = computeStats(parsed);
        setStatResult(res);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred');
    }
  };

  const handleInsert = (value: string) => {
    onInsertValue(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <Text style={styles.modalTitle}>
            {mode === 'nPr' && 'Permutations (nPr)'}
            {mode === 'nCr' && 'Combinations (nCr)'}
            {mode === 'STAT' && 'Descriptive Statistics'}
          </Text>

          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            {/* Input Forms */}
            {mode === 'nPr' || mode === 'nCr' ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Enter n (total items):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 5"
                  placeholderTextColor="#444"
                  keyboardType="number-pad"
                  value={valN}
                  onChangeText={setValN}
                />

                <Text style={styles.label}>Enter r (chosen items):</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 3"
                  placeholderTextColor="#444"
                  keyboardType="number-pad"
                  value={valR}
                  onChangeText={setValR}
                />
              </View>
            ) : mode === 'STAT' ? (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Enter numbers (comma separated):</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g. 10.5, 12, 14.8, 16.2"
                  placeholderTextColor="#444"
                  keyboardType="default"
                  multiline={true}
                  numberOfLines={3}
                  value={statInput}
                  onChangeText={setStatInput}
                />
                <Text style={styles.infoText}>
                  Separate values with commas. Supports decimals and negative numbers.
                </Text>
              </View>
            ) : null}

            {/* Error Message */}
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

            {/* Computation Results */}
            {singleResult !== null && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Calculated Result:</Text>
                <Text style={styles.resultValue}>{singleResult}</Text>
                <Pressable
                  style={styles.insertBtn}
                  onPress={() => handleInsert(singleResult)}
                >
                  <Text style={styles.insertBtnText}>Insert into Calculator</Text>
                </Pressable>
              </View>
            )}

            {statResult !== null && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>Calculated Stats:</Text>
                
                {/* Mean Row */}
                <View style={styles.statRow}>
                  <View>
                    <Text style={styles.statLabel}>Mean (Average):</Text>
                    <Text style={styles.statValue}>{statResult.mean}</Text>
                  </View>
                  <Pressable
                    style={styles.miniInsertBtn}
                    onPress={() => handleInsert(statResult.mean.toString())}
                  >
                    <Text style={styles.miniInsertBtnText}>Insert</Text>
                  </Pressable>
                </View>

                {/* Variance Row */}
                <View style={styles.statRow}>
                  <View>
                    <Text style={styles.statLabel}>Variance (σ²):</Text>
                    <Text style={styles.statValue}>{statResult.variance}</Text>
                  </View>
                  <Pressable
                    style={styles.miniInsertBtn}
                    onPress={() => handleInsert(statResult.variance.toString())}
                  >
                    <Text style={styles.miniInsertBtnText}>Insert</Text>
                  </Pressable>
                </View>

                {/* Standard Deviation Row */}
                <View style={styles.statRow}>
                  <View>
                    <Text style={styles.statLabel}>Std Dev (σ):</Text>
                    <Text style={styles.statValue}>{statResult.stdDev}</Text>
                  </View>
                  <Pressable
                    style={styles.miniInsertBtn}
                    onPress={() => handleInsert(statResult.stdDev.toString())}
                  >
                    <Text style={styles.miniInsertBtnText}>Insert</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Row */}
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.actionBtn, styles.closeBtn]}
              onPress={onClose}
            >
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.computeBtn]}
              onPress={handleCompute}
            >
              <Text style={styles.computeBtnText}>Compute</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: theme.colors.modalBackground,
    borderRadius: theme.shapes.borderRadius,
    borderWidth: 1.5,
    borderColor: '#2A2A3E',
    padding: 20,
    elevation: 20,
    shadowColor: '#00F0FF',
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.accentCyan,
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 240, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scrollContainer: {
    paddingBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#AAA',
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    color: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    borderWidth: 1,
    borderColor: '#3A3A54',
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoText: {
    color: '#666',
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    marginTop: -8,
    marginBottom: 15,
  },
  errorText: {
    color: theme.colors.accentMagenta,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2A3E',
    paddingTop: 15,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  closeBtn: {
    backgroundColor: theme.colors.keyBase,
    borderWidth: 1,
    borderColor: '#333',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: theme.fonts.bold,
  },
  computeBtn: {
    backgroundColor: theme.colors.accentCyan,
  },
  computeBtnText: {
    color: '#0A0A0F',
    fontSize: 15,
    fontFamily: theme.fonts.bold,
  },
  resultContainer: {
    backgroundColor: '#161625',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A44',
    marginTop: 10,
  },
  resultLabel: {
    color: '#888',
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    marginBottom: 8,
  },
  resultValue: {
    color: theme.colors.accentYellow,
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    marginVertical: 10,
  },
  insertBtn: {
    backgroundColor: theme.colors.accentMagenta,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  insertBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: theme.fonts.bold,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#252538',
  },
  statLabel: {
    color: '#BBB',
    fontSize: 12,
    fontFamily: theme.fonts.regular,
  },
  statValue: {
    color: theme.colors.accentYellow,
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    marginTop: 2,
  },
  miniInsertBtn: {
    backgroundColor: '#0D2B35',
    borderWidth: 1,
    borderColor: theme.colors.accentCyan,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  miniInsertBtnText: {
    color: theme.colors.accentCyan,
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
});
