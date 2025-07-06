import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react';
import {
  addVideo,
  getUserVideos,
  uploadVideoFile,
  deleteVideo,
  updateVideo, // Make sure this exists in ApiService.jsx
} from '../services/ApiService';

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const res = await getUserVideos();
      if (res.success && res.data) {
        setVideos(res.data);
      } else {
        console.error('Failed to fetch videos:', res.message);
      }
    } catch (err) {
      console.error('Error loading videos:', err);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl('');
    }
  };

  const handleAddVideo = async () => {
    if (!file || !title.trim() || !description.trim() || !category.trim()) {
      alert('Please fill all fields and select a video.');
      return;
    }

    const token = sessionStorage.getItem('auth_token');
    const userId = sessionStorage.getItem('userId');
    if (!token || !userId) {
      alert('You are not logged in. Please log in again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('video', file);
      const uploadRes = await uploadVideoFile(formData);
      if (!uploadRes.success) {
        alert('Upload failed.');
        return;
      }

      const videoData = {
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        url: uploadRes.filename,
      };

      const addRes = await addVideo(videoData);
      if (addRes.success) {
        setTitle('');
        setDescription('');
        setCategory('');
        setFile(null);
        setPreviewUrl('');
        loadVideos();
      } else {
        alert('Failed to add video metadata: ' + addRes.message);
      }
    } catch (err) {
      console.error('Upload error:', err.message);
      alert('Upload failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const res = await deleteVideo(id);
      if (res.success) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
      } else {
        alert('Delete failed: ' + res.message);
      }
    } catch (err) {
      console.error('Delete error:', err.message);
      alert('Failed to delete video.');
    }
  };

  // Editing handlers
  const startEditing = (video) => {
    setEditingVideoId(video.id);
    setEditTitle(video.title);
    setEditDescription(video.description || '');
    setEditCategory(video.category);
  };

  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditTitle('');
    setEditDescription('');
    setEditCategory('');
  };

  const saveEditing = async () => {
    if (!editTitle.trim() || !editCategory.trim()) {
      alert('Title and category are required.');
      return;
    }

    try {
      const res = await updateVideo(editingVideoId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory.trim(),
      });

      if (res.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === editingVideoId
              ? {
                  ...v,
                  title: editTitle.trim(),
                  description: editDescription.trim(),
                  category: editCategory.trim(),
                }
              : v
          )
        );
        cancelEditing();
      } else {
        alert('Update failed: ' + res.message);
      }
    } catch (err) {
      alert('Update failed: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">🎬 Video Manager</h2>

      {/* Upload Form */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 transition-all">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="🎞️ Title"
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:italic"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="📝 Description"
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:italic"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="📁 Category"
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:italic"
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="file:mr-3 file:border-none file:bg-blue-100 file:text-blue-700 border border-gray-300 rounded-lg p-3"
        />
        <button
          onClick={handleAddVideo}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 hover:from-blue-700 transition-all flex items-center justify-center"
        >
          <Plus className="mr-2" size={18} /> Upload
        </button>
      </div>

      {/* Preview Section */}
      {previewUrl && (
        <div className="mb-10">
          <p className="text-sm text-gray-700 mb-2 font-medium">Preview:</p>
          <video src={previewUrl} controls className="rounded-xl shadow-lg w-full max-w-lg mx-auto" />
        </div>
      )}

      {/* Video Gallery */}
      {videos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">🚫 No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                if (editingVideoId !== video.id) {
                  navigate(`/video-player/${video.id}`);
                }
              }}
              className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group relative"
            >
              <div className="relative">
                <video
                  controls
                  className="rounded-t-2xl w-full h-52 object-cover group-hover:opacity-90 transition"
                >
                  <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-4 space-y-2">
                {editingVideoId === video.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                      rows={2}
                    />
                    <input
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEditing();
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditing();
                        }}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-800 truncate">{video.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                    <p className="text-xs italic text-gray-500">Category: {video.category}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(video.upload_datetime).toLocaleDateString()}
                    </div>

                    {/* Edit button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(video);
                      }}
                      className="absolute top-3 left-3 bg-yellow-500 text-white rounded-full p-2 hover:bg-yellow-600 transition"
                      title="Edit Video"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigating to player on delete click
                  handleDelete(video.id);
                }}
                className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
                title="Delete Video"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Video;
