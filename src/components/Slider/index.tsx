'use client';
interface SliderProps {
  words: string[];
  descriptions: string[];
}

export function Slider({ words, descriptions }: SliderProps) {
  return (
    <div className="flex flex-col text-center">
      <div className="p-6 ">
        {words.map((word, index) => (
          <span
            key={index}
            className={'text-6xl text-lime-300 font-bold text-center'}
          >
            {word}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-white text-xl font-bold">{descriptions}</p>
      </div>
    </div>
  );
}
