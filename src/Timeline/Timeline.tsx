import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import useTimeStore from "../stores/useTimeStore";
import { useSyncScroll } from "../hooks/useSyncScroll";

export const Timeline = () => {
  const trackCount = 10;
  const rulerRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);
  const keyframeListRef = useRef<HTMLDivElement>(null);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isPlayheadHidden, setIsPlayheadHidden] = useState(false);

  const syncScroll = useSyncScroll();
  const { currentTime, durationTime, setCurrentTime, setDurationTime } =
    useTimeStore();

  const handleRulerScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      syncScroll(e, [{ ref: keyframeListRef, axis: "left" }]);
      setScrollLeft(e.currentTarget.scrollLeft);
    },
    [syncScroll]
  );

  const handleTrackListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      syncScroll(e, [{ ref: keyframeListRef, axis: "top" }]);
    },
    [syncScroll]
  );

  const handleKeyframeListScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      syncScroll(e, [
        { ref: rulerRef, axis: "left" },
        { ref: trackListRef, axis: "top" },
      ]);
      setScrollLeft(e.currentTarget.scrollLeft);
    },
    [syncScroll]
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

  const containerStyles = useMemo(
    () =>
      "relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] bg-gray-800 border-t-2 border-solid border-gray-700",
    []
  );

  return (
    <div className={containerStyles} data-testid="timeline">
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
      <TrackList
        ref={trackListRef}
        onScroll={handleTrackListScroll}
        count={trackCount}
      />
      <KeyframeList
        ref={keyframeListRef}
        onScroll={handleKeyframeListScroll}
        count={trackCount}
      />
      <Playhead position={playheadPosition} isHidden={isPlayheadHidden} />
    </div>
  );
};
