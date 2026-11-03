import { PERIODS, PERIOD_LABEL } from '@/lib/params';

interface PeriodTabsProps {
  value: number;
  onChange(index: number): void;
}

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Período"
      className="relative grid grid-cols-3 rounded-full border-2 border-black bg-white/40 p-1"
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-black transition-transform duration-300 motion-reduce:transition-none"
        style={{ transform: `translateX(${value * 100}%)` }}
      />
      {PERIODS.map((period, index) => (
        <button
          key={period}
          type="button"
          role="tab"
          aria-selected={value === index}
          onClick={() => onChange(index)}
          className={`relative z-10 rounded-full px-5 py-1.5 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
            value === index ? 'text-[#FFE818]' : 'text-black'
          }`}
        >
          {PERIOD_LABEL[period]}
        </button>
      ))}
    </div>
  );
}
