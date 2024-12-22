import { useCallback } from "react";
import NumericInput from "./NumericInput";

interface PlayControlsProps {
  currentTime: number;
  setCurrentTime: (current: number) => void;
  durationTime: number;
  setDurationTime: (duration: number) => void;
}

export const PlayControls = ({
  currentTime,
  durationTime,
  setCurrentTime,
  setDurationTime,
}: PlayControlsProps) => {
  const onDurationChange = useCallback(
    (duration: number) => {
      setCurrentTime(currentTime > duration ? duration : currentTime);
      setDurationTime(duration);
    },
    [currentTime]
  );

  const onTimeChange = useCallback(
    (currentTime: number) => {
      setCurrentTime(currentTime > durationTime ? durationTime : currentTime);
    },
    [durationTime]
  );

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 
 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <NumericInput
          dataTestId="current-time-input"
          min={0}
          max={durationTime}
          step={10}
          defaultValue={currentTime}
          onChange={onTimeChange}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumericInput
          dataTestId="duration-input"
          min={100}
          max={6000}
          step={10}
          defaultValue={durationTime}
          onChange={onDurationChange}
        />
        Duration
      </fieldset>
    </div>
  );
};
