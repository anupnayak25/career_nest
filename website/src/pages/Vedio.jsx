import React, { useEffect, useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { addVideo, getUserVideos } from '../services/ApiService';

const Vedio = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const data = await getUserVideos();
    setVideos(data);
  };

  const handleAddVideo = async () => {
    if (!file || !title || !description || !category) {
      alert("Please fill all fields and select a video.");
      return;
    }

    // 1. Upload video file
    const formData = new FormData();
    formData.append('video', file);

    const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/upload`, {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      alert("Video upload failed");
      return;
    }

    // 2. Save metadata with uploaded filename
    const userId = sessionStorage.getItem('userId');
    const newVideo = {
      title,
      description,
      category,
      url: uploadData.url,
      user_id: userId,
      upload_datetime: new Date().toISOString(),
    };

    await addVideo(newVideo);

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setFile(null);
    loadVideos();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🎬 Video Manager</h2>

        <div className="grid grid-cols-5 gap-2 mt-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border rounded px-2 py-1 col-span-1"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border rounded px-2 py-1 col-span-1"
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="border rounded px-2 py-1 col-span-1"
          />
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border rounded px-2 py-1 col-span-1"
          />
          <button
            onClick={handleAddVideo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center col-span-1"
          >
            <Plus className="inline mr-1" size={18} /> Add Video
          </button>
        </div>
      </div>

      {videos.length === 0 ? (
        <p className="text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white p-4 rounded shadow border">
              <h3 className="text-lg font-bold">{video.title}</h3>
              <p className="text-sm text-gray-600">{video.description}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(video.upload_datetime).toLocaleDateString()}
              </div>
              <video controls className="mt-2 w-full max-w-md rounded">
                <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vedio;
