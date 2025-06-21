import { Calendar, Trophy } from 'lucide-react'
import React, { useState } from 'react'
import VideoCard from '../components/VideoCard'

function VideoPage() {
 const [dashboardTab, setDashboardTab] = useState('events');

  // Sample video data
  const eventsVideos = [
    {
      id: 1,
      title: "Industry Expert Talk: AI in Education",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop",
      duration: "45:30",
      views: "1.2K",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Career Guidance Workshop 2024",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      duration: "1:15:20",
      views: "2.5K",
      date: "1 week ago"
    },
    {
      id: 3,
      title: "Student Success Stories Panel",
      thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=225&fit=crop",
      duration: "38:45",
      views: "890",
      date: "3 days ago"
    },
    {
      id: 4,
      title: "Future of Remote Learning",
      thumbnail: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=225&fit=crop",
      duration: "52:15",
      views: "1.8K",
      date: "5 days ago"
    }
  ];

  const placementsVideos = [
    {
      id: 1,
      title: "Google Placement Success Story",
      thumbnail: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=225&fit=crop",
      duration: "12:30",
      views: "5.2K",
      date: "1 day ago"
    },
    {
      id: 2,
      title: "Microsoft Interview Preparation",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop",
      duration: "28:45",
      views: "3.8K",
      date: "4 days ago"
    },
    {
      id: 3,
      title: "Amazon SDE Role Requirements",
      thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=225&fit=crop",
      duration: "35:20",
      views: "4.1K",
      date: "1 week ago"
    },
    {
      id: 4,
      title: "Startup vs Corporate: Career Paths",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      duration: "41:10",
      views: "2.9K",
      date: "2 weeks ago"
    }
  ];
    
  return (
       <div className="space-y-6">

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setDashboardTab('events')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              dashboardTab === 'events'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="inline mr-2" size={16} />
            Events
          </button>
          <button
            onClick={() => setDashboardTab('placements')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              dashboardTab === 'placements'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trophy className="inline mr-2" size={16} />
            Placements
          </button>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(dashboardTab === 'events' ? eventsVideos : placementsVideos).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoPage