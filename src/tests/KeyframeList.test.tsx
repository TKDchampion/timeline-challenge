import { render, screen, fireEvent } from "@testing-library/react";
import { KeyframeList } from "../Timeline/KeyframeList";

describe("KeyframeList Component", () => {
  const mockOnScroll = jest.fn();

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("Vertical scrolling is synchronized with the Track List", () => {
    render(<KeyframeList count={10} onScroll={mockOnScroll} ref={null} />);

    const keyframeList = screen.getByTestId("keyframe-list");

    Object.defineProperty(keyframeList, "scrollTop", {
      value: 0,
      writable: true,
    });

    fireEvent.scroll(keyframeList, { target: { scrollTop: 100 } });

    expect(mockOnScroll).toHaveBeenCalledTimes(1);
    expect(mockOnScroll).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          scrollTop: 100,
        }),
      })
    );
  });

  test("Horizontal scrolling is synchronized with the Ruler", () => {
    render(<KeyframeList count={10} onScroll={mockOnScroll} ref={null} />);

    const keyframeList = screen.getByTestId("keyframe-list");

    Object.defineProperty(keyframeList, "scrollLeft", {
      value: 0,
      writable: true,
    });

    fireEvent.scroll(keyframeList, { target: { scrollLeft: 150 } });

    expect(mockOnScroll).toHaveBeenCalledTimes(1);
    expect(mockOnScroll).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          scrollLeft: 150,
        }),
      })
    );
  });

  test("Segment length visually represents the total Duration (1ms = 1px)", () => {
    const duration = 1000;
    render(<KeyframeList count={1} onScroll={mockOnScroll} ref={null} />);

    const segment = screen.getByTestId("segment");

    Object.defineProperty(segment, "offsetWidth", {
      value: duration,
    });

    expect(segment.offsetWidth).toBe(duration);
  });
});
