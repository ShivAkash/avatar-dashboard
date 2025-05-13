"use client"

import React from 'react'

const MODEL_URLS = [
  "https://sketchfab.com/models/b1044722512546e9b3e49c0ec10f0d18/embed?autospin=1&autostart=1",  // Realistic Women
  "https://sketchfab.com/models/e332a41a98a94b19983b291c039696ca/embed?autospin=1&autostart=1",  // Cyberpunk women
  "https://sketchfab.com/models/8a9c805dc9f54839b6d7b6e7b1a48761/embed?autospin=1&autostart=1"   // Casual Man
]

interface ThreeDProps {
  userId: string | number;
}

export default function ThreeDAvatar({ userId }: ThreeDProps) {
  const modelIndex = typeof userId === 'number' 
    ? Math.abs(userId) % MODEL_URLS.length 
    : Math.abs(parseInt(userId as string, 10)) % MODEL_URLS.length || 0;
    
  const modelUrl = MODEL_URLS[modelIndex];
  
  return (
    <div className="sketchfab-embed-wrapper" style={{ width: '100%', height: '300px' }}>
      <iframe 
        title="3D Avatar"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        style={{ width: '100%', height: '100%' }}
        src={modelUrl}
      />
    </div>
  );
}