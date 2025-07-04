import React, { useState } from 'react';

const ToggleSwitch = ({
  onToggle,
  initialState = false,
}) => {
  const [isToggled, setIsToggled] = useState(initialState);

  const handleToggle = () => {
    const newState = !isToggled;
    setIsToggled(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="toggle-switch-container">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={isToggled}
          onChange={handleToggle}
        />
        <span className="slider round">
          <span className="slider-text">AR</span>
        </span>
      </label>
    </div>
  );
};

export default ToggleSwitch;