import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, Upload, X } from "lucide-react";
import {
  addVideo,
  getUserVideos,
  uploadVideoFile,
  uploadMultipleVideoFiles,
  addMultipleVideos,
  deleteVideo,
  updateVideo,
} from "../services/ApiService";
import { useToast } from "../ui/Toast";
import Alert from "../ui/AlertDailog";

const Video = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]); // For multiple files
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]); // For multiple previews
  const [isMultipleMode, setIsMultipleMode] = useState(false); // Toggle between single/multiple
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    if (!token) {
      showToast("🔐 Not logged in, redirecting to login...", "warning");
      navigate("/signin");
      return;
    }
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const res = await getUserVideos();
      if (res.success && res.data) {
        setVideos(res.data);
      } else {
        showToast("Failed to fetch videos: " + res.message, "error");
      }
    } catch (err) {
      showToast("Error loading videos.", "error");
      console.error("loadVideos error:", err);
    }
  };

  const handleFileChange = (e) => {
    if (isMultipleMode) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
      // Create preview URLs for multiple files
      const urls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(selected ? URL.createObjectURL(selected) : "");
    }
  };

  const removeFile = (index) => {
    if (isMultipleMode) {
      const newFiles = files.filter((_, i) => i !== index);
      const newUrls = previewUrls.filter((_, i) => i !== index);
      
      // Revoke the removed URL to free memory
      URL.revokeObjectURL(previewUrls[index]);
      
      setFiles(newFiles);
      setPreviewUrls(newUrls);
    }
  };

  const clearAllFiles = () => {
    if (isMultipleMode) {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setFiles([]);
      setPreviewUrls([]);
    } else {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl("");
    }
  };

  const handleAddVideo = async () => {
    if (!file || !title.trim() || !description.trim() || !category.trim()) {
      showToast("Please fill all fields and select a video.", "warning");
      return;
    }

    const token = sessionStorage.getItem("auth_token");
    const userId = sessionStorage.getItem("userId");

    if (!token || !userId) {
      showToast("Session expired. Please log in again.", "error");
      navigate("/signin");
      return;
    }

    try {
      // Step 1: Upload the video file
      const formData = new FormData();
      formData.append("video", file);
      const uploadRes = await uploadVideoFile(formData);

      if (!uploadRes.success) {
        showToast("Upload failed: " + uploadRes.message, "error");
        return;
      }

      // Step 2: Save video metadata
      const videoData = {
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        url: uploadRes.filename,
      };

      const addRes = await addVideo(videoData);
      if (addRes.success) {
        setTitle("");
        setDescription("");
        setCategory("");
        setFile(null);
        setPreviewUrl("");
        loadVideos();
        showToast("🎉 Video uploaded successfully!", "success");
      } else {
        showToast("Failed to add video metadata: " + addRes.message, "error");
      }
    } catch (err) {
      console.error("handleAddVideo error:", err);
      
      // Handle specific error types
      if (err.message.includes("HTML instead of JSON") || err.message.includes("auth")) {
        showToast("Authentication failed. Please log in again.", "error");
        navigate("/signin");
      } else if (err.message.includes("<!DOCTYPE")) {
        showToast("Server error: Received HTML page instead of JSON response. Check server logs.", "error");
      } else {
        showToast("Upload failed: " + err.message, "error");
      }
    }
  };

  const handleAddMultipleVideos = async () => {
    if (!files.length || !title.trim() || !description.trim() || !category.trim()) {
      showToast("Please fill all fields and select videos.", "warning");
      return;
    }

    const token = sessionStorage.getItem("auth_token");
    const userId = sessionStorage.getItem("userId");

    if (!token || !userId) {
      showToast("Session expired. Please log in again.", "error");
      navigate("/signin");
      return;
    }

    try {
      // Step 1: Upload multiple video files
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("videos", file);
      });

      showToast("Uploading videos...", "info");
      const uploadRes = await uploadMultipleVideoFiles(formData);

      if (!uploadRes.success) {
        showToast("Upload failed: " + uploadRes.message, "error");
        return;
      }

      // Step 2: Save video metadata for all uploaded files
      const videosData = uploadRes.files.map((file, index) => ({
        title: `${title.trim()} ${files.length > 1 ? `(${index + 1})` : ''}`,
        description: description.trim(),
        category: category.trim(),
        url: file.filename,
      }));

      const addRes = await addMultipleVideos(videosData);
      if (addRes.success) {
        setTitle("");
        setDescription("");
        setCategory("");
        clearAllFiles();
        loadVideos();
        showToast(`🎉 ${uploadRes.count} videos uploaded successfully!`, "success");
      } else {
        showToast("Failed to add videos metadata: " + addRes.message, "error");
      }
    } catch (err) {
      console.error("handleAddMultipleVideos error:", err);
      
      // Handle specific error types
      if (err.message.includes("HTML instead of JSON") || err.message.includes("auth")) {
        showToast("Authentication failed. Please log in again.", "error");
        navigate("/signin");
      } else if (err.message.includes("<!DOCTYPE")) {
        showToast("Server error: Received HTML page instead of JSON response. Check server logs.", "error");
      } else {
        showToast("Upload failed: " + err.message, "error");
      }
    }
  };

  const handleDelete = (id) => {
    setVideoToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      const res = await deleteVideo(videoToDelete);
      if (res.success) {
        setVideos((prev) => prev.filter((v) => v.id !== videoToDelete));
        showToast("Video deleted successfully!", "success");
      } else {
        showToast("Delete failed: " + res.message, "error");
      }
    } catch (err) {
      showToast("Delete error: " + err.message, "error");
    } finally {
      setShowDeleteConfirm(false);
      setVideoToDelete(null);
    }
  };

  const startEditing = (video) => {
    setEditingVideoId(video.id);
    setEditTitle(video.title);
    setEditDescription(video.description || "");
    setEditCategory(video.category || "");
  };

  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditTitle("");
    setEditDescription("");
    setEditCategory("");
  };

  const saveEditing = async () => {
    if (!editTitle.trim() || !editCategory.trim()) {
      showToast("Title and category are required.", "warning");
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
        showToast("Video updated successfully!", "success");
      } else {
        showToast("Update failed: " + res.message, "error");
      }
    } catch (err) {
      showToast("Update error: " + err.message, "error");
    }
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">🎬 Video Manager</h2>

      {/* Upload Mode Toggle */}
      <div className="bg-white/90 border border-gray-200 rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => {
              setIsMultipleMode(false);
              clearAllFiles();
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              !isMultipleMode
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Single Upload
          </button>
          <button
            onClick={() => {
              setIsMultipleMode(true);
              clearAllFiles();
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              isMultipleMode
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Multiple Upload
          </button>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-md p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder={isMultipleMode ? "🎞️ Base Title (numbers will be added)" : "🎞️ Title"} 
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
        </div>
        
        <div className="flex gap-4 items-center">
          <input 
            type="file" 
            accept="video/*" 
            multiple={isMultipleMode}
            onChange={handleFileChange} 
            className="file:mr-3 file:border-none file:bg-blue-100 file:text-blue-700 border border-gray-300 rounded-lg p-3 flex-1" 
          />
          {isMultipleMode ? (
            <button 
              onClick={handleAddMultipleVideos} 
              className="bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 hover:from-green-700 transition-all flex items-center justify-center whitespace-nowrap"
            >
              <Upload className="mr-2" size={18} /> Upload All ({files.length})
            </button>
          ) : (
            <button 
              onClick={handleAddVideo} 
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 hover:from-blue-700 transition-all flex items-center justify-center whitespace-nowrap"
            >
              <Plus className="mr-2" size={18} /> Upload
            </button>
          )}
          {((isMultipleMode && files.length > 0) || (!isMultipleMode && file)) && (
            <button 
              onClick={clearAllFiles} 
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-all"
              title="Clear files"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {!isMultipleMode && previewUrl && (
        <div className="mb-10">
          <p className="text-sm text-gray-700 mb-2 font-medium">Preview:</p>
          <video src={previewUrl} controls className="rounded-xl shadow-lg w-full max-w-lg mx-auto" />
        </div>
      )}

      {/* Multiple Files Preview */}
      {isMultipleMode && files.length > 0 && (
        <div className="mb-10">
          <p className="text-sm text-gray-700 mb-4 font-medium">Selected Videos ({files.length}):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative bg-white rounded-lg shadow-md overflow-hidden">
                <video 
                  src={previewUrls[index]} 
                  controls={false}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Grid */}
      {videos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">🚫 No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => editingVideoId !== video.id && navigate(`/video-player/${video.id}`)}
              className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group relative"
            >
              <video controls className="rounded-t-2xl w-full h-52 object-cover group-hover:opacity-90 transition">
                <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
              </video>
              <div className="p-4 space-y-2">
                {editingVideoId === video.id ? (
                  <>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-full" />
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-full" rows={2} />
                    <input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-full" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={(e) => { e.stopPropagation(); saveEditing(); }} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Save</button>
                      <button onClick={(e) => { e.stopPropagation(); cancelEditing(); }} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-800 truncate">{video.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                    <p className="text-xs italic text-gray-500">Category: {video.category}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(video.publish_date).toLocaleDateString()}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); startEditing(video); }} className="absolute top-3 left-3 bg-yellow-500 text-white rounded-full p-2 hover:bg-yellow-600 transition" title="Edit Video">✏️</button>
                  </>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(video.id); }} className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition" title="Delete Video">🗑️</button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <Alert
        isVisible={showDeleteConfirm}
        text="Are you sure you want to delete this video?"
        type="warning"
        onResult={(confirmed) => {
          if (confirmed) {
            confirmDelete();
          } else {
            setShowDeleteConfirm(false);
            setVideoToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default Video;
