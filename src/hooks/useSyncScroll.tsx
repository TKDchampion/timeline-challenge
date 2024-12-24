import { useCallback } from "react";

export const useSyncScroll = () => {
  const syncScroll = useCallback(
    (
      sourceEvent: React.UIEvent<HTMLDivElement>,
      targets: { ref: React.RefObject<HTMLDivElement>; axis: "left" | "top" }[]
    ) => {
      const { currentTarget } = sourceEvent;
      targets.forEach(({ ref, axis }) => {
        if (ref.current) {
          if (axis === "left")
            ref.current.scrollLeft = currentTarget.scrollLeft;
          if (axis === "top") ref.current.scrollTop = currentTarget.scrollTop;
        }
      });
    },
    []
  );

  return syncScroll;
};
