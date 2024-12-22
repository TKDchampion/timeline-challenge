import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import useTimeStore from "../stores/useTimeStore";
import { useCallback, useEffect, useRef, useState } from "react";

export const Timeline = () => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isPlayheadHidden, setIsPlayheadHidden] = useState(false);
  const { currentTime, durationTime, setCurrentTime, setDurationTime } =
    useTimeStore();

  const handleRulerScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (keyframeListRef.current) {
      keyframeListRef.current.scrollLeft = e.currentTarget.scrollLeft;
      setScrollLeft(e.currentTarget.scrollLeft);
    }
  }, []);

  const handleKeyframeListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (rulerRef.current) {
        rulerRef.current.scrollLeft = e.currentTarget.scrollLeft;
        setScrollLeft(e.currentTarget.scrollLeft);
      }
    },
    []
  );

  useEffect(() => {
    if (keyframeListRef.current) {
      const keyframeRect = keyframeListRef.current.getBoundingClientRect();
      const newPlayheadPosition = currentTime - scrollLeft;
      setPlayheadPosition(newPlayheadPosition);
      setIsPlayheadHidden(
        !(newPlayheadPosition >= 0 && newPlayheadPosition <= keyframeRect.width)
      );
    }
  }, [currentTime, scrollLeft]);

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        durationTime={durationTime}
        setDurationTime={setDurationTime}
      />
      <Ruler
        setCurrentTime={setCurrentTime}
        durationTime={durationTime}
        ref={rulerRef}
        onScroll={handleRulerScroll}
      />
      <TrackList />
      <KeyframeList
        ref={keyframeListRef}
        onScroll={handleKeyframeListScroll}
        count={10}
      />
      <Playhead position={playheadPosition} isHidden={isPlayheadHidden} />
    </div>
  );
};
