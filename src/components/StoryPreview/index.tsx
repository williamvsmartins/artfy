interface StoryPreviewProps {
  src: string;
}

export function StoryPreview({ src }: StoryPreviewProps) {
  return (
    <figure className="flex flex-col items-center gap-3">
      <div className="w-44 overflow-hidden rounded-[2rem] border-[6px] border-neutral-700 bg-[#FFE818] shadow-2xl">
        <img
          src={src}
          alt="Exemplo de wallpaper polaroid do Artfy no formato de story"
          width={1080}
          height={1920}
          loading="lazy"
          decoding="async"
          className="block aspect-[9/16] w-full object-cover"
        />
      </div>
      <figcaption className="text-sm font-semibold text-neutral-300">
        é assim que fica no seu story
      </figcaption>
    </figure>
  );
}
