import { CardBack } from '@/components/CardBack';

const STACK = ['-rotate-6', 'rotate-3', '-rotate-1'];

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-6">
      <div className="grid motion-safe:animate-pulse">
        {STACK.map((rotation) => (
          <div key={rotation} className={`[grid-area:1/1] ${rotation}`}>
            <CardBack title="ARTFY" />
          </div>
        ))}
      </div>
      <p className="text-lg font-bold text-lime-300">
        Embaralhando suas músicas…
      </p>
    </div>
  );
}
