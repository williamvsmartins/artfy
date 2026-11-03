import {
  STORY_H,
  STORY_W,
  polaroidLayout,
  titleFontSize,
  truncate
} from './polaroid-layout';

import type { Track } from '@/types/track';

const YELLOW = '#FFE818';
const OUTLINE = [
  '4px 0 0 #000',
  '-4px 0 0 #000',
  '0 4px 0 #000',
  '0 -4px 0 #000',
  '3px 3px 0 #000',
  '-3px -3px 0 #000',
  '3px -3px 0 #000',
  '-3px 3px 0 #000'
].join(', ');

interface PolaroidStoryProps {
  title: string;
  tracks: Track[];
  qrDataUrl: string;
  host: string;
}

export function PolaroidStory({
  title,
  tracks,
  qrDataUrl,
  host
}: PolaroidStoryProps) {
  const slots = polaroidLayout(tracks.length)
    .map((slot, i) => ({ slot, track: tracks[i] }))
    .sort((a, b) => a.slot.z - b.slot.z);
  const [top] = tracks;

  return (
    <div
      style={{
        width: STORY_W,
        height: STORY_H,
        display: 'flex',
        position: 'relative',
        background: YELLOW,
        fontFamily: 'Inter'
      }}
    >
      {slots.map(({ slot, track }) => (
        <div
          key={track.id}
          style={{
            position: 'absolute',
            left: slot.x,
            top: slot.y,
            width: slot.size,
            display: 'flex',
            padding: '12px 12px 44px',
            background: '#fff',
            transform: `rotate(${slot.rotate}deg)`,
            boxShadow: '0 12px 28px rgba(0,0,0,0.3)'
          }}
        >
          {track.coverLarge ? (
            <img
              src={track.coverLarge}
              width={slot.size - 24}
              height={slot.size - 24}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: slot.size - 24,
                height: slot.size - 24,
                background: track.dominantColor ?? '#27272a'
              }}
            />
          )}
        </div>
      ))}

      <div
        style={{
          position: 'absolute',
          top: 1390,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontSize: titleFontSize(title),
            fontWeight: 800,
            color: YELLOW,
            textShadow: OUTLINE,
            letterSpacing: 2
          }}
        >
          {title}
        </div>
        {top && (
          <div style={{ marginTop: 18, fontSize: 38, color: '#000' }}>
            {`#1 ${truncate(top.name, 28)} · ${truncate(
              top.artists.join(', '),
              22
            )}`}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 70,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: '#000' }}>
            {host}
          </div>
          <div style={{ fontSize: 34, color: '#000' }}>crie o seu</div>
        </div>
        <img
          src={qrDataUrl}
          width={170}
          height={170}
          style={{ border: '6px solid #000', borderRadius: 16 }}
        />
      </div>
    </div>
  );
}
