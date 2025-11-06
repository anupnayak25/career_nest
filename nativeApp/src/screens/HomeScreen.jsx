import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Welcome{user ? `, ${user.name}` : ''}</Text>
      <Text>Use the tabs to explore features.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  h1: { fontSize: 22, fontWeight: '600', marginBottom: 8 },
});
