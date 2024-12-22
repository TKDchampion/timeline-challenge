import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import useTimeStore from "../stores/useTimeStore";

export const Timeline = () => {
  const { currentTime, durationTime, setCurrentTime, setDurationTime } =
    useTimeStore();

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
      <Ruler />
      <TrackList />
      <KeyframeList />
      <Playhead time={currentTime} />
    </div>
  );
};
