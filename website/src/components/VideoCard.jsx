import { Play } from 'lucide-react';
import React from 'react'

  const VideoCard = ({ video }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Play className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300" size={48} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{video.views} views</span>
          <span>{video.date}</span>
        </div>
      </div>
    </div>
  );


export default VideoCard