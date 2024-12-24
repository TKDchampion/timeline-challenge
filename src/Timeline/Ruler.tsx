import React, { forwardRef, useCallback, useMemo, useRef } from "react";

interface RulerProps {
  setCurrentTime: (time: number) => void;
  durationTime: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const Ruler = React.memo(
  forwardRef<HTMLDivElement, RulerProps>(
    ({ durationTime, onScroll, setCurrentTime }, ref) => {
      const rulerBarRef = useRef<HTMLDivElement>(null);
      const lastTimeRef = useRef<number | null>(null);

      const calculateNewTime = useCallback(
        (clientX: number) => {
          if (!rulerBarRef.current) return 0;

          const { left, width } = rulerBarRef.current.getBoundingClientRect();
          const position = Math.max(0, Math.min(clientX - left, width));
          return Math.round(((position / width) * durationTime) / 10) * 10;
        },
        [durationTime]
      );

      const updateTime = useCallback(
        (clientX: number) => {
          const newTime = calculateNewTime(clientX);
          if (newTime && newTime !== lastTimeRef.current) {
            lastTimeRef.current = newTime;
            setCurrentTime(newTime);
          }
        },
        [calculateNewTime, setCurrentTime]
      );

      const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
          updateTime(e.clientX);

          const handleMouseMove = (e: MouseEvent) => updateTime(e.clientX);
          const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
          };

          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);
        },
        [updateTime]
      );

      const rulerStyle = useMemo(
        () => ({ width: `${durationTime}px` }),
        [durationTime]
      );

      return (
        <div
          className="px-4 py-2 min-w-0 border-b border-solid border-gray-700 overflow-x-auto overflow-y-hidden"
          data-testid="ruler"
          ref={ref}
          onScroll={onScroll}
        >
          <div
            className="w-[2000px] h-full rounded-md bg-white/25"
            data-testid="ruler-bar"
            ref={rulerBarRef}
            style={rulerStyle}
            onMouseDown={handleMouseDown}
          ></div>
        </div>
      );
    }
  )
);
