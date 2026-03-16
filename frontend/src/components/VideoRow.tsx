"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";

interface Video {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
}

export function VideoRow() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  const videosPerPage = 3; // 3 videos per row for better visibility

  useEffect(() => {
    // Load videos from API
    const loadVideos = async () => {
      try {
        const response = await fetch('/api/admin/videos');
        if (response.ok) {
          const data = await response.json();
          const videoData: Video[] = data.videos.map((video: any, index: number) => ({
            id: video.id,
            name: video.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            url: video.url
          }));

          setVideos(videoData);
        } else {
          // Fallback to static videos if API fails
          const videoFiles = [
            "WhatsApp Video 2026-03-11 at 14.56.17.mp4",
            "WhatsApp Video 2026-03-12 at 12.40.59.mp4"
          ];

          const videoData: Video[] = videoFiles.map((fileName, index) => ({
            id: `video-${index}`,
            name: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
            url: `/images/products/${fileName}`
          }));

          setVideos(videoData);
        }
      } catch (error) {
        console.error("Error loading videos:", error);
        // Fallback to static videos
        const videoFiles = [
          "WhatsApp Video 2026-03-11 at 14.56.17.mp4",
          "WhatsApp Video 2026-03-12 at 12.40.59.mp4"
        ];

        const videoData: Video[] = videoFiles.map((fileName, index) => ({
          id: `video-${index}`,
          name: fileName.replace(/\.[^/.]+$/, ""), // Remove file extension
          url: `/images/products/${fileName}`
        }));

        setVideos(videoData);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();

    // Set up periodic refresh to check for new videos
    const interval = setInterval(loadVideos, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Cleanup videos on unmount
  useEffect(() => {
    return () => {
      Object.values(videoRefs.current).forEach(video => {
        if (video) {
          video.pause();
          video.src = '';
        }
      });
    };
  }, []);

  // Navigation logic
  const maxIndex = Math.max(0, videos.length - videosPerPage);
  
  const goToPrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - videosPerPage));
  };

  const goToNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + videosPerPage));
  };

  const togglePlay = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    
    if (playingVideo === videoId && videoElement) {
      // Pause the current video
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // Stop any currently playing video first
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }
      
      // Play the new video
      if (videoElement) {
        videoElement.play().catch(error => {
          console.error("Error playing video:", error);
        });
        setPlayingVideo(videoId);
      }
    }
  };

  const toggleMute = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        if (videoElement) {
          videoElement.muted = false;
        }
      } else {
        newSet.add(videoId);
        if (videoElement) {
          videoElement.muted = true;
        }
      }
      return newSet;
    });
  };

  const currentVideos = videos.slice(currentIndex, currentIndex + videosPerPage);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Découvrez nos <span className="text-green-600">vidéos produits</span>
          </h2>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex space-x-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null; // Don't show anything if no videos
  }

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Découvrez nos <span className="text-green-600">vidéos produits</span>
        </h2>
        
        {/* Navigation buttons */}
        {videos.length > videosPerPage && (
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full transition-colors ${
                currentIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-sm text-gray-600">
              {Math.floor(currentIndex / videosPerPage) + 1} / {Math.ceil(videos.length / videosPerPage)}
            </span>
            
            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className={`p-2 rounded-full transition-colors ${
                currentIndex >= maxIndex
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Videos Row */}
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 pb-4">
          {currentVideos.map((video) => (
            <div
              key={video.id}
              className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Video Container */}
              <div className="relative h-48 bg-black overflow-hidden group">
                <video
                  ref={(el) => { videoRefs.current[video.id] = el; }}
                  className="w-full h-full object-cover"
                  playsInline
                  muted={mutedVideos.has(video.id)}
                  loop
                  onClick={() => togglePlay(video.id)}
                >
                  <source src={video.url} type="video/mp4" />
                  Votre navigateur ne supporte pas les vidéos.
                </video>
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    {/* Play/Pause Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(video.id);
                      }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    >
                      {playingVideo === video.id ? (
                        <Pause className="w-4 h-4 text-gray-800" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-800" />
                      )}
                    </button>
                    
                    {/* Mute/Unmute Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute(video.id);
                      }}
                      className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                    >
                      {mutedVideos.has(video.id) ? (
                        <VolumeX className="w-4 h-4 text-gray-800" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-gray-800" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Play indicator when not playing */}
                {playingVideo !== video.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <Play className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Video Info */}
              <div className="p-4">
                {/* Video Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.name}
                </h3>
                
                {/* Video Type Badge */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Vidéo produit
                  </span>
                  <span className="text-xs text-gray-500">
                    Cliquez pour jouer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* View all products link */}
      <div className="text-center">
        <a 
          href="/produits" 
          className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Découvrir tous nos produits
          <ChevronRight className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
}
