'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

export const GlobalBackground: React.FC = () => {
  const [bgImage, setBgImage] = useState<string>('/background.png');

  useEffect(() => {
    api.get('/component-settings/global')
      .then(res => {
        if (res.data?.content?.background_image) {
          setBgImage(res.data.content.background_image);
        }
      })
      .catch((err) => console.error("Could not load global background", err));
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        opacity: 0.3,
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};
