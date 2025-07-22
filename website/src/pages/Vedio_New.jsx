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
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);

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

    // Only show videos with valid categories (Placement or Event)
    filtered = filtered.filter(video => 
      video.category === 'Placement' || video.category === 'Event'
    );

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Removed category filtering - show all Placement and Event videos

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
  }, [videos, searchTerm, sortBy]);

  const getCategories = () => {
    return ["Placement", "Event"];
  };

  const getStats = () => {
    const totalVideos = videos.length;
    const placementVideos = videos.filter(v => v.category === 'Placement').length;
    const eventVideos = videos.filter(v => v.category === 'Event').length;
    
    return {
      totalVideos,
      placementVideos,
      eventVideos,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🎬 <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">Video Manager</span>
              </h1>
              <p className="text-gray-600 text-sm mt-1">Upload and manage your placement and event videos</p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all text-sm"
            >
              <BarChart3 size={18} />
              Stats
            </button>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg">
                <div className="text-xl font-bold">{stats.totalVideos}</div>
                <div className="text-red-100 text-sm">Total Videos</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg">
                <div className="text-xl font-bold">{stats.placementVideos}</div>
                <div className="text-green-100 text-sm">Placement Videos</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg">
                <div className="text-xl font-bold">{stats.eventVideos}</div>
                <div className="text-purple-100 text-sm">Event Videos</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg">
                <div className="text-xl font-bold">{stats.filtered}</div>
                <div className="text-blue-100 text-sm">Filtered Results</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Upload Mode Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mr-6">Upload Videos</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setIsMultipleMode(false);
                  clearAllFiles();
                }}
                className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                  !isMultipleMode
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Plus className="inline mr-1" size={14} />
                Single
              </button>
              <button
                onClick={() => {
                  setIsMultipleMode(true);
                  clearAllFiles();
                }}
                className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                  isMultipleMode
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="inline mr-1" size={14} />
                Multiple
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter description" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" 
                  disabled={isUploading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white" 
                  disabled={isUploading}
                >
                  <option value="">Select category</option>
                  <option value="Placement">Placement</option>
                  <option value="Event">Event</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {isMultipleMode ? "Select Videos" : "Select Video"}
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-all duration-300 bg-gray-50 hover:bg-blue-50">
                  <input 
                    type="file" 
                    accept="video/*" 
                    multiple={isMultipleMode}
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    disabled={isUploading}
                  />
                  <div className="text-gray-600">
                    <Upload className="mx-auto mb-2" size={24} />
                    <p className="text-sm">
                      {isMultipleMode 
                        ? "Drop video files here or click to browse" 
                        : "Drop a video file here or click to browse"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports MP4, AVI, MOV files
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Single Upload Button */}
              <button 
                onClick={isMultipleMode ? handleAddMultipleVideos : handleAddVideo} 
                disabled={(!files.length && !file) || isUploading}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Video{isMultipleMode && files.length > 1 ? `s (${files.length})` : ''}
                  </>
                )}
              </button>
              
              {((isMultipleMode && files.length > 0) || (!isMultipleMode && file)) && (
                <button 
                  onClick={clearAllFiles} 
                  disabled={isUploading}
                  className="px-4 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                  title="Clear files"
                >
                  <X size={20} />
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
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" 
                    ? "bg-red-100 text-red-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" 
                    ? "bg-red-100 text-red-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={18} />
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
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6" 
              : "space-y-4"
          }`}>
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-200 ${
                  viewMode === "list" ? "flex items-center" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <video 
                        controls={false}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          if (editingVideoId !== video.id) {
                            setPreviewVideo(video);
                            setShowPreviewModal(true);
                          }
                        }}
                      >
                        <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
                      </video>
                      
                      {/* YouTube-style play button overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="bg-red-600 bg-opacity-90 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
                          <Play className="text-white fill-white ml-1" size={24} />
                        </div>
                      </div>
                      
                      {/* Video duration badge */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        4:32
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewVideo(video);
                            setShowPreviewModal(true);
                          }}
                          className="bg-gray-900 bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
                          title="Preview Video"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(video);
                          }}
                          className="bg-gray-900 bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
                          title="Edit Video"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(video.id);
                          }}
                          className="bg-gray-900 bg-opacity-80 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
                          title="Delete Video"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      {editingVideoId === video.id ? (
                        <div className="space-y-3">
                          <input 
                            value={editTitle} 
                            onChange={(e) => setEditTitle(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                            placeholder="Title"
                          />
                          <textarea 
                            value={editDescription} 
                            onChange={(e) => setEditDescription(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" 
                            rows={2}
                            placeholder="Description"
                          />
                          <select 
                            value={editCategory} 
                            onChange={(e) => setEditCategory(e.target.value)} 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white" 
                          >
                            <option value="">Select category</option>
                            <option value="Placement">Placement</option>
                            <option value="Event">Event</option>
                          </select>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                saveEditing(); 
                              }} 
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-all"
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
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1">{video.title}</h3>
                          <p className="text-xs text-gray-600 mb-1">Career Nest</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              {new Date(video.publish_date).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              video.category === 'Placement' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {video.category}
                            </span>
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

        {/* Video Preview Modal */}
        {showPreviewModal && previewVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex-1 mr-4">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{previewVideo.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-1">{previewVideo.description}</p>
                </div>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    setPreviewVideo(null);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4 bg-black">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    controls
                    className="w-full h-full object-contain"
                    src={`${import.meta.env.VITE_API_URL}/videos/${previewVideo.url}`}
                    autoPlay
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                    previewVideo.category === 'Placement' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {previewVideo.category}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar size={14} />
                    {new Date(previewVideo.publish_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
