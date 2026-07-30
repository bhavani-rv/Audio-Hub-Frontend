import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ minutes = 5, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft === 0) {
      if (onComplete) onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center mb-6">
      <p className="text-textSecondary text-sm">Time remaining to verify</p>
      <p className={`text-2xl font-mono font-bold mt-1 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
        {formatTime(timeLeft)}
      </p>
    </div>
  );
};

export default CountdownTimer;
