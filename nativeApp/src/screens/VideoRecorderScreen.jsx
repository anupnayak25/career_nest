import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function VideoRecorderScreen() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [lastFile, setLastFile] = useState(null);

  const recordAndUpload = async () => {
    try {
      const result = await launchCamera({ mediaType: 'video' });
      if (result.didCancel || !result.assets || !result.assets[0]) return;
      const asset = result.assets[0];
      setUploading(true);
      const { data: uploadRes } = await api.uploadVideo(asset.uri, asset.fileName);
      setLastFile(uploadRes.filename);

      if (user?.id) {
        await api.saveVideoMeta({
          user_id: user.id,
          url: uploadRes.filename,
          category: 'general',
          title: asset.fileName || 'Recorded video',
          description: 'Uploaded from React Native',
        });
      }

      Alert.alert('Success', 'Video uploaded');
    } catch (e) {
      console.error(e);
      Alert.alert('Upload failed', e?.response?.data?.message || 'Please try again');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record & Upload</Text>
      <Button title={uploading ? 'Uploading...' : 'Record video'} onPress={recordAndUpload} disabled={uploading} />
      {lastFile && <Text style={{ marginTop: 8 }}>Last file: {lastFile}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
});
