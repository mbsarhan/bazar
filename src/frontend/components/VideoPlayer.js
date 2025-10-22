// src/frontend/components/VideoPlayer.js
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Import the default Video.js styles

/**
 * A reusable wrapper component for the Video.js player.
 * It correctly handles the player's initialization and cleanup lifecycle.
 * @param {object} props - The component props.
 * @param {object} props.options - The Video.js options object (including sources).
 * @param {function} props.onReady - A callback function for when the player is ready.
 */
const VideoPlayer = ({ options, onReady }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);

    // This effect handles the initialization and destruction of the player.
    useEffect(() => {
        // Make sure we only initialize the player once.
        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return; // Don't do anything if the video tag isn't in the DOM.

            // Initialize the player and store the instance in our ref.
            playerRef.current = videojs(videoElement, options, () => {
                console.log('Video.js player is ready');
                onReady && onReady(playerRef.current);
            });
        }

        // This is the cleanup function.
        // It's crucial for preventing memory leaks when you navigate away from the page.
        return () => {
            const player = playerRef.current;
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [options, onReady]); // The effect depends on the options.

    return (
        <div data-vjs-player>
            {/* The video tag has a ref that Video.js will use to attach the player. */}
            <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
    );
};

export default VideoPlayer;