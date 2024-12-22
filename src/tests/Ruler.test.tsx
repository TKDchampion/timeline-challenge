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

  beforeEach(() => {
    jest.clearAllMocks();
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
