import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { api } from '../services/api';

const CATEGORIES = [
  'All',
  'Campus Placement',
  'Off-Campus Drive',
  'Virtual Event',
  'Coding Competition',
  'Technical Workshop',
  'Career Fair',
  'Industry Talk',
  'Mock Interview',
  'Placement',
  'Event',
];

export default function VideoManagerScreen() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [uploadVisible, setUploadVisible] = useState(false);
  const [upTitle, setUpTitle] = useState('');
  const [upDesc, setUpDesc] = useState('');
  const [upCategory, setUpCategory] = useState('Placement');
  const [upFile, setUpFile] = useState(null);
  const [upLoading, setUpLoading] = useState(false);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const { data } = await api.listVideos();
      setVideos(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesSearch = !s || (v.title || '').toLowerCase().includes(s);
      const matchesCategory = category === 'All' || v.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [videos, search, category]);

  const pickVideo = async () => {
    const res = await launchImageLibrary({ mediaType: 'video', selectionLimit: 1 });
    if (res.didCancel) return;
    const asset = res?.assets?.[0];
    if (!asset) return;
    setUpFile(asset);
  };

  const doUpload = async () => {
    if (!upFile || !upTitle.trim()) {
      Alert.alert('Missing info', 'Please select a video and enter title');
      return;
    }
    try {
      setUpLoading(true);
      const { data: uploadRes } = await api.uploadVideo(upFile.uri, upFile.fileName || 'video.mp4');
      const filename = uploadRes?.filename || uploadRes?.fileName || uploadRes?.url;
      if (!filename) throw new Error('Upload did not return filename');

      const payload = {
        title: upTitle.trim(),
        description: upDesc.trim(),
        category: upCategory,
        url: filename,
      };
      const { status } = await api.saveVideoMeta(payload);
      if (status === 201 || status === 200) {
        setUploadVisible(false);
        setUpTitle('');
        setUpDesc('');
        setUpFile(null);
        await loadVideos();
        Alert.alert('Success', 'Video uploaded');
      } else {
        throw new Error('Failed to save metadata');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Upload failed', e?.response?.data?.error || e.message || 'Please try again');
    } finally {
      setUpLoading(false);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert('Delete Video', 'Are you sure you want to delete this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteVideo(id);
            await loadVideos();
          } catch (e) {
            Alert.alert('Failed', 'Could not delete video');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.thumb}>
        <Ionicons name="play-circle" size={40} color="#888" />
      </View>
      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title || 'Untitled'}
        </Text>
        <Text style={styles.category}>{item.category || 'Uncategorized'}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => { /* TODO: preview */ }}>
            <Ionicons name="play" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#fee2e2' }]} onPress={() => confirmDelete(item.id)}>
            <Ionicons name="trash" size={18} color="#b91c1c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Manager</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setUploadVisible(true)}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color="#666" />
          <TextInput
            placeholder="Search videos..."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
        <View style={styles.categoryRow}>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(c) => c}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item: c }) => (
              <Pressable
                onPress={() => setCategory(c)}
                style={[styles.chip, category === c && styles.chipActive]}
              >
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
                  {c}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : filtered.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>No videos found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      <Modal visible={uploadVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Video</Text>
              <TouchableOpacity onPress={() => setUploadVisible(false)}>
                <Ionicons name="close" size={22} />
              </TouchableOpacity>
            </View>
            <TextInput
              placeholder="Video Title"
              value={upTitle}
              onChangeText={setUpTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description (optional)"
              value={upDesc}
              onChangeText={setUpDesc}
              style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              multiline
            />
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Category</Text>
              <FlatList
                data={CATEGORIES.filter((c) => c !== 'All')}
                keyExtractor={(c) => c}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: c }) => (
                  <Pressable
                    onPress={() => setUpCategory(c)}
                    style={[styles.chip, upCategory === c && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, upCategory === c && styles.chipTextActive]}>
                      {c}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
            <TouchableOpacity style={styles.filePicker} onPress={pickVideo}>
              <Ionicons name="cloud-upload" size={28} color="#666" />
              <Text style={{ marginTop: 8, color: '#666' }}>
                {upFile ? upFile.fileName : 'Tap to select video file'}
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
              <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => setUploadVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <View style={{ width: 12 }} />
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={doUpload} disabled={upLoading}>
                {upLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff' }}>Upload</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  addBtn: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addBtnText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  filters: { padding: 16 },
  searchBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryRow: { marginTop: 12 },
  chip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { color: '#111827', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  thumb: {
    width: 120,
    height: 90,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { flex: 1, padding: 10 },
  title: { fontWeight: '700' },
  category: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', marginTop: 8, gap: 8 },
  iconBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  filePicker: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  btnGhost: { backgroundColor: '#fff' },
  btnPrimary: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
});
