import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = sessionStorage.getItem('auth_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setVideo(data.data);
        } else {
          console.error('Video not found');
        }
      } catch (err) {
        console.error('Error fetching video:', err);
      }
    };

    fetchVideo();
  }, [id]);

  if (!video) return <p className="p-6">Loading video...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
      <p className="text-gray-700 mb-2">{video.description}</p>
      <video controls className="w-full max-w-3xl rounded">
        <source src={`${import.meta.env.VITE_API_URL}/videos/${video.url}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
