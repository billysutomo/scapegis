"use client";
import React, { useRef, useEffect, useState } from "react";
import MapManager from "./lib/MapManager";
import DrawingControl from "./components/DrawingControl";
import { io } from 'socket.io-client';
import Overlay from 'ol/Overlay';

const socket = io('http://localhost:8001');

interface CursorData {
  userId: string;
  x: number;
  y: number;
}

interface CursorPosition {
  x: number;
  y: number;
}

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isCursor, setIsCursor] = useState(false);
  const [isArea, setIsArea] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const otherCursors = useRef<Map<string, Overlay>>(new Map());
  const [userId] = useState(() => `user-${Math.floor(Math.random() * 10000)}`); // Generate random userId

  useEffect(() => {
    MapManager.getInstance(mapRef);

    const throttledEmit = throttle((x: number, y: number) => {
      socket.emit('cursor_position', {
        userId,
        x,
        y,
      });
    }, 15); 

    // Handle mouse move event and send the cursor position
    const handleMouseMove = (event: MouseEvent) => {
      const newPosition: CursorPosition = { x: event.clientX, y: event.clientY };
      setCursorPosition(newPosition);

      // Use throttledEmit to delay socket emissions
      throttledEmit(event.clientX, event.clientY);
    };

    // Listen for mouse move events
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mapRef, userId]);

  useEffect(() => {
    // Listen for other users' cursor positions from WebSocket
    socket.on('broadcast_cursor_position', (data: CursorData) => {
      const { userId: incomingUserId, x, y } = data;

      // Ignore if the userId matches the current user's ID
      if (incomingUserId === userId) return;

      const mapManager = MapManager.getInstance(mapRef);
      const map = mapManager.getMap();
      if (!map) return;

      // Convert screen coordinates to map coordinates
      const mapCoordinates = map.getCoordinateFromPixel([x, y]);

      // Check if the user already has an overlay
      if (otherCursors.current.has(incomingUserId)) {
        // Update existing overlay position
        const existingOverlay = otherCursors.current.get(incomingUserId);
        existingOverlay?.setPosition(mapCoordinates);
      } else {
        // Create a new overlay for the new user
        const element = document.createElement('div');
        element.className = 'cursor-overlay';
        element.innerHTML = incomingUserId;  // Example: Display the user's ID or an avatar
        element.style.width = '10px';
        element.style.height = '10px';
        element.style.backgroundColor = 'red';
        element.style.borderRadius = '50%';

        const newOverlay = new Overlay({
          position: mapCoordinates,
          positioning: 'center-center',
          element,
          stopEvent: false,  // Allow map interaction under the overlay
        });

        // Add overlay to the map and store it in the ref
        map.addOverlay(newOverlay);
        otherCursors.current.set(incomingUserId, newOverlay);
      }
    });

    return () => {
      socket.off('broadcast_cursor_position');
    };
  }, [userId]);

  const handleCursorTool = () => {
    // Your logic here
  };

  const handleAreaTool = () => {
    const mapManager = MapManager.getInstance(mapRef);
    if (isArea) {
      mapManager.removeDrawInteraction();
      setIsArea(false);
      return;
    }
    mapManager.addDrawInteraction();
    setIsArea(true);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100vh", position: "absolute", top: 0, left: 0 }}></div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <DrawingControl onClickCursorTool={handleCursorTool} onClickAreaTool={handleAreaTool} />
      </div>
    </div>
  );
};

export default Home;

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function (...args: any[]) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
