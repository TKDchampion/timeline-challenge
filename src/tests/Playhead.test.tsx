import { render, screen } from "@testing-library/react";
import { Playhead } from "../Timeline/Playhead";

describe("Playhead Component", () => {
  test("Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", () => {
    const position = 200;
    render(<Playhead position={position} isHidden={false} />);

    const playhead = screen.getByTestId("playhead");

    expect(playhead).toHaveStyle({
      transform: `translateX(calc(${position}px - 50%))`,
    });
  });

  test("Playhead maintains its relative position during horizontal scrolling", () => {
    const initialPosition = 200;
    const scrolledPosition = 150;
    const expectedPosition = initialPosition - scrolledPosition;

    render(<Playhead position={expectedPosition} isHidden={false} />);
    const playhead = screen.getByTestId("playhead");
    expect(playhead).toHaveStyle({
      transform: `translateX(calc(${expectedPosition}px - 50%))`,
    });
  });

  test("Playhead is visible only when within the Timeline's visible area", () => {
    const { rerender } = render(<Playhead position={0} isHidden={true} />);

    const playhead = screen.getByTestId("playhead");

    rerender(<Playhead position={200} isHidden={false} />);
    expect(playhead).not.toHaveAttribute("hidden");

    rerender(<Playhead position={-50} isHidden={true} />);
    expect(playhead).toHaveAttribute("hidden");
  });
});
