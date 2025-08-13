import React from 'react'

function VideoPlayer({url}) {
  return (
    <div>
       <div className="bg-black rounded-xl overflow-hidden shadow-xl mb-6">
              <video 
                controls 
                className="w-full aspect-video"
                poster="/path/to/video-poster.jpg"
              >
                <source src={`${import.meta.env.VITE_API_URL}/videos/${url}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
    </div>
  )
}

export default VideoPlayer
