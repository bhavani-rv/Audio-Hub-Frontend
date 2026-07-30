import React, { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrength(0);
      return;
    }

    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrength(score);
  }, [password]);

  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-border';
      case 1: case 2: return 'bg-red-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      default: return 'bg-border';
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return '';
      case 1: case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-textSecondary">Password Strength</span>
        <span className={`text-xs font-semibold ${
          strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-yellow-500' : strength === 4 ? 'text-blue-500' : 'text-green-500'
        }`}>
          {getStrengthLabel()}
        </span>
      </div>
      <div className="flex gap-1 h-1.5 w-full bg-surface rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              strength >= level ? getStrengthColor() : 'bg-transparent'
            }`}
          ></div>
        ))}
      </div>
      <ul className="mt-2 text-[10px] text-textSecondary space-y-1">
        <li className={password.length >= 8 ? 'text-green-500' : ''}>✓ At least 8 characters</li>
        <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-green-500' : ''}>✓ Uppercase & lowercase letters</li>
        <li className={/[0-9]/.test(password) ? 'text-green-500' : ''}>✓ Includes a number</li>
        <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : ''}>✓ Includes a special character</li>
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
