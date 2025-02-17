// app/community/page.js
"use client";

import { useState } from "react";

export default function Community() {
  const [videos, setVideos] = useState([
    {
      title: "Advanced React Patterns",
      description: "Learn advanced patterns and techniques in React.",
      videoUrl: "https://www.youtube.com/embed/ABC123", // Replace with actual video links
    },
    {
      title: "Node.js Performance Optimization",
      description: "Tips and tricks to optimize Node.js applications.",
      videoUrl: "https://www.youtube.com/embed/XYZ456", // Replace with actual video links
    },
    // Add more videos as needed
  ]);

  return (
    <div className="community-container py-10 bg-gray-800 text-white min-h-screen">
      <h1 className="text-4xl text-center mb-8">Community Videos</h1>
      <div className="video-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <div key={index} className="video-card bg-gray-700 p-6 rounded-xl shadow-lg">
            <iframe
              width="100%"
              height="200"
              src={video.videoUrl}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            />
            <h3 className="text-xl font-bold mt-4">{video.title}</h3>
            <p className="text-sm text-gray-400 mt-2">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
