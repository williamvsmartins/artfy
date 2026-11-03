interface CardBackProps {
  title: string;
}

export function CardBack({ title }: CardBackProps) {
  return (
    <div className="flex h-full min-h-[26rem] w-80 flex-col items-center justify-between rounded-xl border-4 border-black bg-[#FFE818] p-6 text-black">
      <span className="text-xs font-bold uppercase tracking-[0.3em]">
        artfy
      </span>
      <div className="flex flex-col items-center gap-2">
        <span className="text-outline text-8xl font-extrabold leading-none">
          ?
        </span>
        <span className="text-outline text-center text-4xl font-extrabold">
          {title}
        </span>
      </div>
      <span className="text-xs font-semibold">vire para descobrir</span>
    </div>
  );
}
