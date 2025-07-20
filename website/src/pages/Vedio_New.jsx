import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, Upload, X, Search, Filter, Grid, List, Play, Edit, Trash2, Eye, BarChart3 } from "lucide-react";
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
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isMultipleMode, setIsMultipleMode] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  
  // New UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [showStats, setShowStats] = useState(false);

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
  }, [navigate, showToast]);

  const loadVideos = async () => {
    try {
      const res = await getUserVideos();
      if (res.success && res.data) {
        setVideos(res.data);
        setFilteredVideos(res.data);
      } else {
        showToast("Failed to fetch videos: " + res.message, "error");
      }
    } catch (err) {
      showToast("Error loading videos.", "error");
      console.error("loadVideos error:", err);
    }
  };

  // Filter and sort videos
  useEffect(() => {
    let filtered = [...videos];

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.publish_date) - new Date(b.publish_date);
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return new Date(b.publish_date) - new Date(a.publish_date);
      }
    });

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedCategory, sortBy]);

  const getCategories = () => {
    const categories = [...new Set(videos.map(video => video.category))];
    return categories.filter(Boolean);
  };

  const getStats = () => {
    const totalVideos = videos.length;
    const categories = getCategories().length;
    
    return {
      totalVideos,
      categories,
      filtered: filteredVideos.length
    };
  };

  const handleFileChange = (e) => {
    if (isMultipleMode) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
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

    setIsUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(20);
      showToast("📤 Uploading video file...", "info");
      
      const formData = new FormData();
      formData.append("video", file);
      const uploadRes = await uploadVideoFile(formData);

      if (!uploadRes.success) {
        showToast("Upload failed: " + uploadRes.message, "error");
        return;
      }

      setUploadProgress(70);
      showToast("💾 Saving video metadata...", "info");

      const videoData = {
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        url: uploadRes.filename,
      };

      const addRes = await addVideo(videoData);
      setUploadProgress(100);
      
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
      
      if (err.message.includes("HTML instead of JSON") || err.message.includes("auth")) {
        showToast("Authentication failed. Please log in again.", "error");
        navigate("/signin");
      } else if (err.message.includes("<!DOCTYPE")) {
        showToast("Server error: Received HTML page instead of JSON response. Check server logs.", "error");
      } else {
        showToast("Upload failed: " + err.message, "error");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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

    setIsUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(20);
      showToast(`📤 Uploading ${files.length} videos...`, "info");
      
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("videos", file);
      });

      const uploadRes = await uploadMultipleVideoFiles(formData);

      if (!uploadRes.success) {
        showToast("Upload failed: " + uploadRes.message, "error");
        return;
      }

      setUploadProgress(70);
      showToast("💾 Saving videos metadata...", "info");

      const videosData = uploadRes.files.map((file, index) => ({
        title: `${title.trim()} ${files.length > 1 ? `(${index + 1})` : ''}`,
        description: description.trim(),
        category: category.trim(),
        url: file.filename,
      }));

      const addRes = await addMultipleVideos(videosData);
      setUploadProgress(100);
      
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
      
      if (err.message.includes("HTML instead of JSON") || err.message.includes("auth")) {
        showToast("Authentication failed. Please log in again.", "error");
        navigate("/signin");
      } else if (err.message.includes("<!DOCTYPE")) {
        showToast("Server error: Received HTML page instead of JSON response. Check server logs.", "error");
      } else {
        showToast("Upload failed: " + err.message, "error");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
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
    setEditCategory(video.category);
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

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                🎬 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Video Manager</span>
              </h1>
              <p className="text-gray-600 mt-1">Upload, organize, and manage your video content</p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all"
            >
              <BarChart3 size={20} />
              Stats
            </button>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{stats.totalVideos}</div>
                <div className="text-blue-100">Total Videos</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{stats.categories}</div>
                <div className="text-green-100">Categories</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{stats.filtered}</div>
                <div className="text-purple-100">Filtered Results</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl">
                <div className="text-2xl font-bold">{isUploading ? `${uploadProgress}%` : '✓'}</div>
                <div className="text-orange-100">{isUploading ? 'Uploading' : 'Ready'}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Mode Toggle */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => {
                  setIsMultipleMode(false);
                  clearAllFiles();
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  !isMultipleMode
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plus className="inline mr-2" size={16} />
                Single Upload
              </button>
              <button
                onClick={() => {
                  setIsMultipleMode(true);
                  clearAllFiles();
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isMultipleMode
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="inline mr-2" size={16} />
                Multiple Upload
              </button>
            </div>
          </div>

          {/* Upload Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder={isMultipleMode ? "Base title (numbers will be added)" : "Enter video title"} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter description" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  placeholder="Enter category" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                  disabled={isUploading}
                />
              </div>
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {isMultipleMode ? "Select Videos" : "Select Video"}
                </label>
                <input 
                  type="file" 
                  accept="video/*" 
                  multiple={isMultipleMode}
                  onChange={handleFileChange} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:rounded-md transition-all" 
                  disabled={isUploading}
                />
              </div>
              
              {isMultipleMode ? (
                <button 
                  onClick={handleAddMultipleVideos} 
                  disabled={!files.length || isUploading}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload All ({files.length})
                    </>
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleAddVideo} 
                  disabled={!file || isUploading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Upload
                    </>
                  )}
                </button>
              )}
              
              {((isMultipleMode && files.length > 0) || (!isMultipleMode && file)) && (
                <button 
                  onClick={clearAllFiles} 
                  disabled={isUploading}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Clear files"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Upload Progress</span>
                  <span className="text-sm text-blue-600">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {!isMultipleMode && previewUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <video src={previewUrl} controls className="rounded-xl shadow-md w-full max-w-2xl mx-auto" />
          </div>
        )}

        {/* Multiple Files Preview */}
        {isMultipleMode && files.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Videos ({files.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative bg-gray-50 rounded-xl overflow-hidden group">
                  <video 
                    src={previewUrls[index]} 
                    controls={false}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium truncate text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                    title="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {getCategories().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" 
                    ? "bg-blue-100 text-blue-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Videos Grid/List */}
        {filteredVideos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No videos found</h3>
            <p className="text-gray-600">
              {videos.length === 0 
                ? "Upload your first video to get started!" 
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }`}>
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 ${
                  viewMode === "list" ? "flex items-center" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="relative">
                      <video 
                        controls={false}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => editingVideoId !== video.id && navigate(`/video-player/${video.id}`)}
                      >
                        <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" size={32} />
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(video);
                          }}
                          className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-all"
                          title="Edit Video"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(video.id);
                          }}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                          title="Delete Video"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {editingVideoId === video.id ? (
                        <div className="space-y-3">
                          <input 
                            value={editTitle} 
                            onChange={(e) => setEditTitle(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Title"
                          />
                          <textarea 
                            value={editDescription} 
                            onChange={(e) => setEditDescription(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            rows={2}
                            placeholder="Description"
                          />
                          <input 
                            value={editCategory} 
                            onChange={(e) => setEditCategory(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Category"
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                saveEditing(); 
                              }} 
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all"
                            >
                              Save
                            </button>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                cancelEditing(); 
                              }} 
                              className="flex-1 bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{video.category}</span>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(video.publish_date).toLocaleDateString()}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  /* List View */
                  <>
                    <div className="flex-shrink-0">
                      <video 
                        controls={false}
                        className="w-32 h-20 object-cover cursor-pointer rounded-l-2xl"
                        onClick={() => editingVideoId !== video.id && navigate(`/video-player/${video.id}`)}
                      >
                        <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
                      </video>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{video.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{video.category}</span>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(video.publish_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => navigate(`/video-player/${video.id}`)}
                            className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-all"
                            title="Play Video"
                          >
                            <Play size={16} />
                          </button>
                          <button
                            onClick={() => startEditing(video)}
                            className="bg-yellow-100 text-yellow-600 p-2 rounded-lg hover:bg-yellow-200 transition-all"
                            title="Edit Video"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(video.id)}
                            className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-all"
                            title="Delete Video"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        <Alert
          isVisible={showDeleteConfirm}
          text="Are you sure you want to delete this video? This action cannot be undone."
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
    </div>
  );
};

export default Video;
