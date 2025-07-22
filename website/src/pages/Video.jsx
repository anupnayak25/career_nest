import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar, Upload, X, Search, Play, Edit, Trash2, Eye } from "lucide-react";
import {
  addVideo,
  getUserVideos,
  uploadVideoFile,
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
  const [placement, setPlacement] = useState(""); // Changed from category to placement
  const [files, setFiles] = useState([]);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPlacement, setEditPlacement] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  
  // Modal and UI state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();
  const { showToast } = useToast();

  // Available placement/event options
  const placementOptions = [
    "Placement",
    "Event"
  ];

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

  // Filter videos
  useEffect(() => {
    let filtered = [...videos];

    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPlacement && selectedPlacement !== "all") {
      filtered = filtered.filter(video => video.category === selectedPlacement);
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date));

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedPlacement]);

  const getPlacements = () => {
    const placements = [...new Set(videos.map(video => video.category))];
    return placements.filter(Boolean);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const clearFiles = () => {
    setFiles([]);
    setTitle("");
    setDescription("");
    setPlacement("");
  };

  const handleUpload = async () => {
    if (!files.length || !title.trim() || !description.trim() || !placement) {
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
      showToast(`📤 Uploading ${files.length} video(s)...`, "info");
      
      // Upload files one by one for better progress tracking
      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("video", files[i]);
        
        const uploadRes = await uploadVideoFile(formData);
        if (!uploadRes.success) {
          throw new Error(`Upload failed for file ${i + 1}: ${uploadRes.message}`);
        }
        
        uploadedFiles.push(uploadRes.filename);
        setUploadProgress(20 + (i + 1) * (50 / files.length));
      }

      setUploadProgress(80);
      showToast("💾 Saving video metadata...", "info");

      // Save metadata for each video
      for (let i = 0; i < uploadedFiles.length; i++) {
        const videoData = {
          user_id: userId,
          title: files.length > 1 ? `${title.trim()} (${i + 1})` : title.trim(),
          description: description.trim(),
          category: placement,
          url: uploadedFiles[i],
        };

        const addRes = await addVideo(videoData);
        if (!addRes.success) {
          throw new Error(`Failed to save metadata for video ${i + 1}: ${addRes.message}`);
        }
      }

      setUploadProgress(100);
      clearFiles();
      setShowUploadModal(false);
      loadVideos();
      showToast(`🎉 ${files.length} video(s) uploaded successfully!`, "success");
      
    } catch (err) {
      console.error("Upload error:", err);
      
      if (err.message.includes("HTML instead of JSON") || err.message.includes("auth")) {
        showToast("Authentication failed. Please log in again.", "error");
        navigate("/signin");
      } else if (err.message.includes("<!DOCTYPE")) {
        showToast("Server error: Received HTML page instead of JSON response.", "error");
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
    setEditPlacement(video.category);
  };

  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPlacement("");
  };

  const saveEditing = async () => {
    if (!editTitle.trim() || !editPlacement.trim()) {
      showToast("Title and placement are required.", "warning");
      return;
    }

    try {
      const res = await updateVideo(editingVideoId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editPlacement.trim(),
      });

      if (res.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === editingVideoId
              ? {
                  ...v,
                  title: editTitle.trim(),
                  description: editDescription.trim(),
                  category: editPlacement.trim(),
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

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setShowVideoModal(false);
  };

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
              <p className="text-gray-600 mt-1">Upload, organize, and manage placement & event videos</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
            >
              <Upload size={20} />
              Upload Videos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
                value={selectedPlacement}
                onChange={(e) => setSelectedPlacement(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Placements/Events</option>
                {getPlacements().map(placement => (
                  <option key={placement} value={placement}>{placement}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              {filteredVideos.length} video(s) found
            </div>
          </div>
        </div>

        {/* Videos Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-200"
              >
                <div className="relative aspect-video bg-black">
                  <video 
                    controls={false}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openVideoModal(video)}
                  >
                    <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-blue-600 bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
                      <Play className="text-white fill-white ml-0.5" size={24} />
                    </div>
                  </div>
                  
                  {/* Video duration badge (YouTube style) */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    4:32
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(video);
                      }}
                      className="bg-gray-900 bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition-all"
                      title="Edit Video"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video.id);
                      }}
                      className="bg-gray-900 bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition-all"
                      title="Delete Video"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
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
                      <select 
                        value={editPlacement} 
                        onChange={(e) => setEditPlacement(e.target.value)} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select category</option>
                        {placementOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
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
                      <h3 className="font-medium text-gray-900 text-base line-clamp-2 leading-tight mb-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">Career Nest</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {new Date(video.publish_date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          video.category === 'Placement' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {video.category}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Videos</h2>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      clearFiles();
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Title</label>
                    <input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Enter video title" 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      disabled={isUploading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Enter description" 
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      disabled={isUploading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select 
                      value={placement} 
                      onChange={(e) => setPlacement(e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                      disabled={isUploading}
                    >
                      <option value="">Select category</option>
                      {placementOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Videos</label>
                    <input 
                      type="file" 
                      accept="video/*" 
                      multiple
                      onChange={handleFileChange} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:rounded-md transition-all" 
                      disabled={isUploading}
                    />
                  </div>

                  {/* Files Preview */}
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Selected Videos ({files.length})</label>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button
                              onClick={() => {
                                const newFiles = files.filter((_, i) => i !== index);
                                setFiles(newFiles);
                              }}
                              className="text-red-500 hover:text-red-700 transition-all"
                              disabled={isUploading}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={handleUpload} 
                      disabled={!files.length || !title.trim() || !description.trim() || !placement || isUploading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          Upload {files.length > 0 ? `${files.length} Video(s)` : 'Videos'}
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setShowUploadModal(false);
                        clearFiles();
                      }}
                      disabled={isUploading}
                      className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedVideo.title}</h2>
                  <button
                    onClick={closeVideoModal}
                    className="text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    <video 
                      controls
                      className="w-full h-full object-contain"
                      autoPlay
                    >
                      <source src={`${import.meta.env.VITE_API_URL}/videos/${selectedVideo.url}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
                        <p className="text-gray-600">{selectedVideo.description || 'No description provided'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Placement/Event</h3>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{selectedVideo.category}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={16} className="mr-2" />
                        Published on {new Date(selectedVideo.publish_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
