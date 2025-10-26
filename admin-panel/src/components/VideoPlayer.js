// src/frontend/components/VideoPlayer.js
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

/**
 * A reusable wrapper component for the Video.js player.
 */
const VideoPlayer = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Cleanup any previous player before creating a new one
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }

    // Wait until the video element is actually in the DOM
    const timeout = setTimeout(() => {
      const videoElement = videoRef.current;
      if (!videoElement || !videoElement.isConnected) {
        console.warn('Video element not yet in DOM, skipping initialization.');
        return;
      }

      const player = videojs(videoElement, options, () => {
        console.log('✅ Video.js player initialized successfully');
        onReady && onReady(player);
      });

      playerRef.current = player;
    }, 0); // Ensures React has committed the element to DOM

    // Cleanup when unmounting
    return () => {
      clearTimeout(timeout);
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      {/* playsInline avoids unwanted fullscreen behavior on mobile */}
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
