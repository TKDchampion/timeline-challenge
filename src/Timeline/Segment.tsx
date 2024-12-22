import useTimeStore from "../stores/useTimeStore";

export const Segment = () => {
  const { durationTime } = useTimeStore();

  return (
    <div
      className="w-[2000px] py-2"
      data-testid="segment"
      style={{ width: `${durationTime}px` }}
    >
      <div className="h-6 rounded-md bg-white/10"></div>
    </div>
  );
};
