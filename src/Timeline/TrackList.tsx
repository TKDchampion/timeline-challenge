import React, { forwardRef } from "react";

type TrackListProps = {
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  count: number;
};

export const TrackList = React.memo(
  forwardRef<HTMLDivElement, TrackListProps>(({ count, onScroll }, ref) => {
    const tracks = Array.from({ length: count }, (_, index) => ({
      id: index,
      label: `Track ${String.fromCharCode(65 + index)}`,
    }));

    return (
      <div
        className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
        data-testid="track-list"
        ref={ref}
        onScroll={onScroll}
      >
        {tracks.map((track) => (
          <div key={track.id} className="p-2">
            <div>{track.label}</div>
          </div>
        ))}
      </div>
    );
  })
);
