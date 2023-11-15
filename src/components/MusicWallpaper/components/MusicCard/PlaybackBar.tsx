export function PlayBackBar() {
  return (
    <div className="w-full flex-col items-start flex">
      <div className="h-[0.1rem] rounded-full w-full bg-zinc-600">
        <div className="bg-zinc-200 w-8/12 h-[0.1rem] rounded-full"></div>
      </div>
      <div className="self-stretch items-center gap-4 inline-flex">
        <span className="flex-grow flex-shrink text-[0.4rem] text-zinc-400">
          1:35
        </span>
        <span className="text-[0.4rem] text-zinc-400">2:25</span>
      </div>
    </div>
  );
}
