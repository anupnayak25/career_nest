import React, { useEffect, useState } from "react";
import { Calendar, Trophy, Play, Upload, Eye } from "lucide-react";
import { getUserVideos } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast";

const DashboardHome = () => {
  const [dashboardTab, setDashboardTab] = useState("events");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const res = await getUserVideos();
      if (res.success && res.data) {
        setVideos(res.data);
      } else {
        showToast("Failed to fetch videos: " + res.message, "error");
      }
    } catch (err) {
      showToast("Error loading videos.", "error");
      console.error("loadVideos error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Separate videos by category
  const eventsVideos = videos.filter((video) => video.category === "Event");
  const placementsVideos = videos.filter((video) => video.category === "Placement");

  const currentVideos = dashboardTab === "events" ? eventsVideos : placementsVideos;

  const openVideoModal = (video) => {
    // Navigate to video player or open modal
    navigate(`/video-player/${video.id}`);
  };

  const VideoCard = ({ video }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <video
          controls={false}
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => openVideoModal(video)}
        >
          <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Play className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300" size={48} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          5:42
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description || 'No description provided'}</p>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            video.category === 'Placement' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {video.category}
          </span>
          <span>{new Date(video.publish_date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{videos.length}</div>
              <div className="text-blue-100">Total Videos</div>
            </div>
            <Play className="text-blue-200" size={40} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{eventsVideos.length}</div>
              <div className="text-green-100">Event Videos</div>
            </div>
            <Calendar className="text-green-200" size={40} />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{placementsVideos.length}</div>
              <div className="text-purple-100">Placement Videos</div>
            </div>
            <Trophy className="text-purple-200" size={40} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/dashboard/video')}
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
          >
            <Upload className="text-blue-600" size={24} />
            <div className="text-left">
              <div className="font-medium text-gray-900">Upload Videos</div>
              <div className="text-sm text-gray-600">Add new content</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/dashboard/video')}
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200"
          >
            <Eye className="text-green-600" size={24} />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Videos</div>
              <div className="text-sm text-gray-600">Edit and organize</div>
            </div>
          </button>
          <button
            onClick={loadVideos}
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-200"
          >
            <Play className="text-purple-600" size={24} />
            <div className="text-left">
              <div className="font-medium text-gray-900">Refresh</div>
              <div className="text-sm text-gray-600">Reload content</div>
            </div>
          </button>
        </div>
      </div>

      {/* Video Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 animate-fade-in">
          <button
            onClick={() => setDashboardTab("events")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              dashboardTab === "events"
                ? "bg-white text-blue-600 shadow-md animate-fade-in"
                : "text-gray-600 hover:text-gray-900 animate-fade-in"
            }`}
          >
            <Calendar className="inline mr-2" size={16} />
            Events ({eventsVideos.length})
          </button>
          <button
            onClick={() => setDashboardTab("placements")}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              dashboardTab === "placements"
                ? "bg-white text-blue-600 shadow-md animate-fade-in"
                : "text-gray-600 hover:text-gray-900 animate-fade-in"
            }`}
          >
            <Trophy className="inline mr-2" size={16} />
            Placements ({placementsVideos.length})
          </button>
        </div>

        {/* Video Grid */}
        {currentVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {dashboardTab === "events" ? "📅" : "🎯"}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No {dashboardTab} videos found
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your first {dashboardTab} video to get started!
            </p>
            <button
              onClick={() => navigate('/dashboard/video')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <Upload size={20} />
              Upload Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {currentVideos.map((video, idx) => (
              <div
                key={video.id}
                className="transition-all duration-500 transform animate-slide-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <VideoCard video={video} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
