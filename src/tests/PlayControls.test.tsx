import { render, screen, fireEvent } from "@testing-library/react";
import { PlayControls } from "../Timeline/PlayControls";

describe("PlayControls Component", () => {
  const setCurrentTimeMock = jest.fn();
  const setDurationTimeMock = jest.fn();

  const defaultProps = {
    currentTime: 100,
    durationTime: 500,
    setCurrentTime: setCurrentTimeMock,
    setDurationTime: setDurationTimeMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Current Time is always between 0ms and the Duration", () => {
    render(<PlayControls {...defaultProps} />);
    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "-10" } });
    fireEvent.blur(currentTimeInput);

    fireEvent.change(currentTimeInput, { target: { value: "600" } });
    fireEvent.blur(currentTimeInput);
    expect(setCurrentTimeMock).toHaveBeenCalledWith(500);
  });

  test("Current Time adjusts if it exceeds the newly set Duration", () => {
    render(<PlayControls {...defaultProps} />);
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "50" } });
    fireEvent.blur(durationInput);
    expect(setCurrentTimeMock).toHaveBeenCalledWith(50);
    expect(setDurationTimeMock).toHaveBeenCalledWith(50);
  });

  test("Duration is always between 100ms and 6000ms", () => {
    render(<PlayControls {...defaultProps} />);
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "50" } });
    fireEvent.blur(durationInput);
    expect(setDurationTimeMock).toHaveBeenCalledWith(100);

    fireEvent.change(durationInput, { target: { value: "7000" } });
    fireEvent.blur(durationInput);
    expect(setDurationTimeMock).toHaveBeenCalledWith(6000);
  });

  test("Current Time and Duration are always multiples of 10ms", () => {
    render(<PlayControls {...defaultProps} />);
    const currentTimeInput = screen.getByTestId("current-time-input");
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(currentTimeInput, { target: { value: "123" } });
    fireEvent.blur(currentTimeInput);
    expect(setCurrentTimeMock).toHaveBeenCalledWith(120);

    fireEvent.change(durationInput, { target: { value: "4567" } });
    fireEvent.blur(durationInput);
    expect(setDurationTimeMock).toHaveBeenCalledWith(4570);
  });

  test("Current Time and Duration are always positive integers", () => {
    render(<PlayControls {...defaultProps} />);
    const currentTimeInput = screen.getByTestId("current-time-input");
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(currentTimeInput, { target: { value: "-100" } });
    fireEvent.blur(currentTimeInput);
    expect(setCurrentTimeMock).toHaveBeenCalledWith(0);

    fireEvent.change(durationInput, { target: { value: "-500" } });
    fireEvent.blur(durationInput);
    expect(setDurationTimeMock).toHaveBeenCalledWith(100);
  });

  test("Playhead position updates only after specific actions on Current Time input", () => {
    render(<PlayControls {...defaultProps} />);
    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "200" } });

    fireEvent.blur(currentTimeInput);
    expect(setCurrentTimeMock).toHaveBeenCalledWith(200);

    fireEvent.keyDown(currentTimeInput, { key: "Enter" });
    expect(setCurrentTimeMock).toHaveBeenCalledWith(200);

    fireEvent.keyDown(currentTimeInput, { key: "ArrowUp" });
    expect(setCurrentTimeMock).toHaveBeenCalledWith(210);

    fireEvent.keyDown(currentTimeInput, { key: "ArrowDown" });
    expect(setCurrentTimeMock).toHaveBeenCalledWith(190);
  });
});
