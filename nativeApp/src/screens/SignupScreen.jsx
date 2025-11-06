import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function SignupScreen() {
  const { setAuthFromResponse } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    try {
      setLoading(true);
      await api.requestOtp(email.trim());
      setStep(2);
    } catch (e) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndSignup = async () => {
    try {
      setLoading(true);
      await api.verifyOtp(email.trim(), otp.trim());
      const { data } = await api.signUp(name.trim(), email.trim(), password, userType);
      await setAuthFromResponse(data);
    } catch (e) {
      const msg = e?.response?.data?.errors?.[0]?.message || e?.response?.data?.error || 'Failed to sign up';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {step === 1 ? (
        <>
          <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
          <View style={styles.row}>
            {['student', 'faculty', 'admin'].map((t) => (
              <TouchableOpacity key={t} onPress={() => setUserType(t)} style={[styles.pill, userType === t && styles.pillActive]}>
                <Text style={[styles.pillText, userType === t && styles.pillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title={loading ? 'Sending...' : 'Send OTP'} onPress={requestOtp} disabled={loading} />
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 8 }}>OTP sent to {email}</Text>
          <TextInput placeholder="Enter OTP" value={otp} onChangeText={setOtp} style={styles.input} keyboardType="number-pad" />
          <Button title={loading ? 'Creating...' : 'Verify & Sign up'} onPress={verifyAndSignup} disabled={loading} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  pill: { borderWidth: 1, borderColor: '#aaa', borderRadius: 24, paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 6 },
  pillActive: { backgroundColor: '#222' },
  pillText: { color: '#222' },
  pillTextActive: { color: '#fff' },
});
