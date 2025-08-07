import React, { useEffect, useState } from "react";
import { Calendar, Trophy, Play, Upload, Eye } from "lucide-react";
import { getVideos } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/Toast";
import VideoCard from "../components/VideoCard";

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
      const res = await getVideos();
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

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up h-screen align-middle">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className=" mx-auto px-1 sm:px-2 lg:px-4 py-2">
          <div className="flex justify-between items-center p-4">
            <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
              <p className="mt-2 text-gray-600">Welcome back, Professor! Here's what's happening today.</p>
            </div>
        
          </div>
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
