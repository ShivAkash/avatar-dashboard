"use client"

import { motion } from 'framer-motion';

interface AvatarFallbackProps {
  name: string;
}

export default function AvatarFallback({ name }: AvatarFallbackProps) {
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substring(-2);
    }
    return color;
  };
  
  const bgColor = stringToColor(name);
  
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
      <motion.div
        className="text-6xl font-bold text-white rounded-full p-8"
        style={{ backgroundColor: bgColor }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        {name.split(' ').map(n => n[0]).join('')}
      </motion.div>
    </div>
  );
}