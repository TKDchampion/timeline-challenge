import { render, screen, fireEvent } from "@testing-library/react";
import { PlayControls } from "../Timeline/PlayControls";

describe("PlayControls Component", () => {
  const mockSetCurrentTime = jest.fn();
  const mockSetDurationTime = jest.fn();

  const defaultProps = {
    currentTime: 200,
    durationTime: 1000,
    setCurrentTime: mockSetCurrentTime,
    setDurationTime: mockSetDurationTime,
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("Current Time is always between 0ms and the Duration", () => {
    render(<PlayControls {...defaultProps} />);

    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "500" } });
    expect(currentTimeInput).toHaveValue(500);

    fireEvent.change(currentTimeInput, { target: { value: "1500" } });
    fireEvent.blur(currentTimeInput);
    expect(currentTimeInput).toHaveValue(1000);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(1000);

    fireEvent.change(currentTimeInput, { target: { value: "-50" } });
    fireEvent.blur(currentTimeInput);
    expect(currentTimeInput).toHaveValue(0);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(0);
  });

  test("Current Time adjusts if it exceeds the newly set Duration", () => {
    render(<PlayControls {...defaultProps} currentTime={1200} />);

    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "800" } });
    fireEvent.blur(durationInput);
    expect(durationInput).toHaveValue(800);
    expect(mockSetDurationTime).toHaveBeenCalledWith(800);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(800);
  });

  test("Duration is always between 100ms and 6000ms", () => {
    render(<PlayControls {...defaultProps} />);

    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(durationInput, { target: { value: "50" } });
    fireEvent.blur(durationInput);
    expect(durationInput).toHaveValue(100);
    expect(mockSetDurationTime).toHaveBeenCalledWith(100);

    fireEvent.change(durationInput, { target: { value: "7000" } });
    fireEvent.blur(durationInput);
    expect(durationInput).toHaveValue(6000);
    expect(mockSetDurationTime).toHaveBeenCalledWith(6000);
  });

  test("Current Time and Duration are always multiples of 10ms", () => {
    render(<PlayControls {...defaultProps} />);

    const currentTimeInput = screen.getByTestId("current-time-input");
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(currentTimeInput, { target: { value: "203" } });
    fireEvent.blur(currentTimeInput);
    fireEvent.change(durationInput, { target: { value: "1047" } });
    fireEvent.blur(durationInput);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(200);
    expect(mockSetDurationTime).toHaveBeenCalledWith(1050);
  });

  test("Current Time and Duration are always positive integers", () => {
    render(<PlayControls {...defaultProps} />);

    const currentTimeInput = screen.getByTestId("current-time-input");
    const durationInput = screen.getByTestId("duration-input");

    fireEvent.change(currentTimeInput, { target: { value: "-100" } });
    fireEvent.blur(currentTimeInput);
    expect(currentTimeInput).toHaveValue(0);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(0);

    fireEvent.change(durationInput, { target: { value: "-500" } });
    fireEvent.blur(durationInput);
    expect(durationInput).toHaveValue(100);
    expect(mockSetDurationTime).toHaveBeenCalledWith(100);
  });

  test("Playhead position updates only after specific actions", () => {
    render(<PlayControls {...defaultProps} />);

    const currentTimeInput = screen.getByTestId("current-time-input");

    fireEvent.change(currentTimeInput, { target: { value: "400" } });
    expect(mockSetCurrentTime).not.toHaveBeenCalled();

    fireEvent.blur(currentTimeInput);
    expect(mockSetCurrentTime).toHaveBeenCalledWith(400);

    fireEvent.change(currentTimeInput, { target: { value: "600" } });
    fireEvent.keyDown(currentTimeInput, { key: "Enter" });
    expect(mockSetCurrentTime).toHaveBeenCalledWith(600);

    fireEvent.keyDown(currentTimeInput, { key: "ArrowUp" });
    expect(mockSetCurrentTime).toHaveBeenCalled();
  });
});
