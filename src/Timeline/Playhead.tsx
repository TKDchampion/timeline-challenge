import React from "react";

interface PlayheadProps {
  position: number;
  isHidden: boolean;
}

export const Playhead: React.FC<PlayheadProps> = ({ position, isHidden }) => {
  const playheadStyle = {
    transform: `translateX(calc(${position}px - 50%))`,
  };

  return (
    <div
      className="absolute left-[316px] h-full border-l-2 border-solid border-yellow-600 z-10"
      data-testid="playhead"
      style={playheadStyle}
      hidden={isHidden}
    >
      <div className="absolute border-solid border-[5px] border-transparent border-t-yellow-600 -translate-x-1.5" />
    </div>
  );
};
