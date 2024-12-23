import { render, screen, fireEvent } from "@testing-library/react";
import { Ruler } from "../Timeline/Ruler";

describe("Ruler Component", () => {
  const setCurrentTimeMock = jest.fn();
  const onScrollMock = jest.fn();

  const defaultProps = {
    durationTime: 1000,
    setCurrentTime: setCurrentTimeMock,
    onScroll: onScrollMock,
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("Clicking on the Ruler updates the Current Time", () => {
    render(<Ruler {...defaultProps} />);

    const rulerBar = screen.getByTestId("ruler-bar");

    Object.defineProperty(rulerBar, "getBoundingClientRect", {
      value: () => ({
        left: 100,
        width: 1000,
      }),
    });

    fireEvent.mouseDown(rulerBar, { clientX: 600 });
    expect(setCurrentTimeMock).toHaveBeenCalledWith(500);
    expect(setCurrentTimeMock).toHaveBeenCalledTimes(1);
  });

  test("Dragging on the Ruler updates the Current Time multiple times", () => {
    render(<Ruler {...defaultProps} />);

    const rulerBar = screen.getByTestId("ruler-bar");

    Object.defineProperty(rulerBar, "getBoundingClientRect", {
      value: () => ({
        left: 100,
        width: 1000,
      }),
    });

    fireEvent.mouseDown(rulerBar, { clientX: 200 });
    fireEvent.mouseMove(rulerBar, { clientX: 210 });
    fireEvent.mouseMove(document, { clientX: 800 });
    fireEvent.mouseUp(rulerBar);

    expect(setCurrentTimeMock).toHaveBeenCalledWith(100);
    expect(setCurrentTimeMock).toHaveBeenCalledWith(110);
    expect(setCurrentTimeMock).toHaveBeenCalledWith(700);
    expect(setCurrentTimeMock).toHaveBeenCalledTimes(3);
  });

  test("Horizontal scrolling of the Ruler is synchronized with the Keyframe List", () => {
    render(<Ruler {...defaultProps} />);
    const ruler = screen.getByTestId("ruler");

    fireEvent.scroll(ruler, { target: { scrollLeft: 500 } });

    expect(onScrollMock).toHaveBeenCalled();
    expect(onScrollMock.mock.calls[0][0].target.scrollLeft).toBe(500);
  });

  test("Ruler length visually represents the total Duration (1ms = 1px)", () => {
    render(<Ruler {...defaultProps} />);
    const rulerBar = screen.getByTestId("ruler-bar");

    expect(rulerBar).toHaveStyle("width: 1000px");
  });

  test("Ruler length updates only after specific actions on Duration input", () => {
    const { rerender } = render(<Ruler {...defaultProps} />);
    const rulerBar = screen.getByTestId("ruler-bar");

    expect(rulerBar).toHaveStyle("width: 1000px");

    rerender(<Ruler {...defaultProps} durationTime={1500} />);
    expect(rulerBar).toHaveStyle("width: 1500px");
  });
});
