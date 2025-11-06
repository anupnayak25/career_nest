import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Role: {user.type}</Text>
          <View style={{ height: 12 }} />
          <Button title="Sign out" onPress={signOut} />
        </>
      ) : (
        <Text>Not signed in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
