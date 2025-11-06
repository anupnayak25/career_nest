import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StudentDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      <Text>View assigned tests, submit programs, and watch videos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
