import { Play, Calendar, Tag } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to video player page with video ID
    navigate(`/video-player/${video.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* Video thumbnail/preview - using the video element as thumbnail */}
        <video
          className="w-full h-48 object-cover"
          muted
          preload="metadata"
        >
          <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}#t=0.5`} type="video/mp4" />
        </video>
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="bg-blue-600 bg-opacity-90 rounded-full p-3 opacity-0 hover:opacity-100 transition-all duration-200 transform scale-75 hover:scale-100">
            <Play className="text-white fill-white ml-0.5" size={24} />
          </div>
        </div>
        
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            video.category === 'Placement' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {video.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {video.title}
        </h3>
        
        {video.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {video.description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(video.publish_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag size={14} />
            <span>Video</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;