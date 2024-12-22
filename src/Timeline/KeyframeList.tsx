import React, { forwardRef, UIEvent } from "react";
import { Segment } from "./Segment";

interface KeyframeProps {
  count: number;
  onScroll: (e: UIEvent<HTMLDivElement>) => void;
}

export const KeyframeList = React.memo(
  forwardRef<HTMLDivElement, KeyframeProps>(({ count, onScroll }, ref) => {
    const renderSegments = () =>
      Array.from({ length: count }, (_, index) => <Segment key={index} />);

    return (
      <div
        ref={ref}
        className="px-4 min-w-0 overflow-auto"
        data-testid="keyframe-list"
        onScroll={onScroll}
      >
        {renderSegments()}
      </div>
    );
  })
);
