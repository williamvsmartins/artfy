export function PlayBackBar() {
  return (
    <div className="w-full flex-col items-start flex gap-2">
      <div className="h-1 rounded-full w-full bg-zinc-600">
        <div className="bg-zinc-200 w-8/12 h-1 rounded-full"></div>
      </div>
      <div className="self-stretch items-center gap-4 inline-flex">
        <span className="flex-grow flex-shrink text-xs text-zinc-400">
          1:35
        </span>
        <span className="text-xs text-zinc-400">2:25</span>
      </div>
    </div>
  );
}
