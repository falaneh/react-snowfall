import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

const SNOWFLAKE_CHARS = ['❄', '❅', '❆', '*'];
const MAX_FLAKES = 200;

const Snowfall = () => {
  const [flakes, setFlakes] = useState([]);
  const [isSnowing, setIsSnowing] = useState(true);
  const frameRef = useRef(null);
  const lastRunRef = useRef(0);

  const addFlake = useCallback(() => {
    const now = Date.now();
    if (now - lastRunRef.current < 200) return;
    lastRunRef.current = now;

    if (!isSnowing || flakes.length >= MAX_FLAKES) return;

    const newFlake = {
      id: now + Math.random(),
      left: Math.random() * 100,
      char: SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)],
      size: Math.random() * 16 + 8,
      duration: Math.random() * 3 + 4
    };

    setFlakes((prev) => [...prev, newFlake]);
  }, [isSnowing, flakes.length]);

  useEffect(() => {
    if (!isSnowing) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      setFlakes([]);
      return;
    }

    const animate = () => {
      addFlake();
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isSnowing, addFlake]);

  const handleAnimationEnd = (id) => {
    setFlakes((prev) => prev.filter((flake) => flake.id !== id));
  };

  return (
    <div className="container">
      <button className="button" onClick={() => setIsSnowing((prev) => !prev)}>
        {isSnowing ? 'Stop' : 'Start'} Snowfall
      </button>

      {isSnowing &&
        flakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              left: `${flake.left}%`,
              fontSize: `${flake.size}px`,
              animation: `fall ${flake.duration}s linear infinite`
            }}
            onAnimationEnd={() => handleAnimationEnd(flake.id)}
          >
            {flake.char}
          </div>
        ))}
    </div>
  );
};

export default Snowfall;
