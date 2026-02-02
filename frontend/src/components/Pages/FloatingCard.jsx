import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FloatingCards = ({ summaryData }) => {
  const [visibleIndices, setVisibleIndices] = useState([]);

  useEffect(() => {
    summaryData.forEach((_, index) => {
      setTimeout(() => {
        setVisibleIndices((prev) => [...prev, index]);
      }, ( index + 1 ) * 9000); // ⏱️ Start one every 5s
    });
  }, [summaryData]);

  return (
    <div className="relative mb-1 w-full h-[160px] overflow-hidden flip-animationY flip-on-hover">
      {summaryData.map((card, index) => {
        if (!visibleIndices.includes(index)) return null;

        const topOffset = 0 ; // 📏 Equal vertical gap
        const duration = 30; // ⏱️ Total float time

        return (
          <motion.div
            key={index}
            initial={{ x: '-30%' }}
            animate={{ x: '650%' }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
            style={{ top: `${topOffset}px` }}
            onClick={() =>
              card.url &&
              window.open(`${window.location.origin}${card.url}`, '_blank')
            }
            className={`absolute p-4 rounded-xl shadow-lg text-white cursor-pointer ${card.color}`}
          >
            <div className="flex gap-4">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <h2 className="text-lg animate-pulse font-semibold">{card.value}</h2>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              {Object.entries(card.type).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingCards;

