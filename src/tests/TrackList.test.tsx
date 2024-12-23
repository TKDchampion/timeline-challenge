import { render, screen, fireEvent } from "@testing-library/react";
import { TrackList } from "../Timeline/TrackList";

describe("TrackList Component", () => {
  const mockOnScroll = jest.fn();

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("Vertical scrolling of the Track List triggers synchronization", () => {
    const trackCount = 10;
    render(<TrackList count={trackCount} onScroll={mockOnScroll} ref={null} />);

    const trackList = screen.getByTestId("track-list");

    Object.defineProperty(trackList, "scrollTop", {
      value: 0,
      writable: true,
    });

    fireEvent.scroll(trackList, { target: { scrollTop: 100 } });
    expect(mockOnScroll).toHaveBeenCalledTimes(1);
    expect(mockOnScroll).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          scrollTop: 100,
        }),
      })
    );
  });
});
