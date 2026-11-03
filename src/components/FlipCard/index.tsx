interface FlipCardProps {
  flipped: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
}

export function FlipCard({ flipped, front, back }: FlipCardProps) {
  return (
    <div className="[perspective:1200px]">
      <div
        className={`grid transition-transform duration-[600ms] ease-out [transform-style:preserve-3d] motion-reduce:transition-none ${
          flipped ? '' : '[transform:rotateY(180deg)]'
        }`}
      >
        <div
          aria-hidden={!flipped}
          className="[grid-area:1/1] [backface-visibility:hidden]"
        >
          {front}
        </div>
        <div
          aria-hidden={flipped}
          className="[grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          {back}
        </div>
      </div>
    </div>
  );
}
