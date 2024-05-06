import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';

import { SwiperWallpaper } from '@/components/SwiperWallpaper';

import { authConfig, loginIsRequiredServer } from '@/lib/auth';
import { extractDominantColor } from '@/lib/extractDominantColor';
import { TopTrackService } from '@/services/http/topTrack';

const getTopTrack = async (
  timeRange: 'long_term' | 'medium_term' | 'short_term',
  session: Session | null
) => {
  try {
    const items = (await TopTrackService.getAll(timeRange, session)) ?? [];
    for (const item of items) {
      if (item.album.images && item.album.images.length > 0) {
        const imageUrl = item.album.images[0].url as string;
        const dominantColor = await extractDominantColor(imageUrl);
        item.dominantColor = dominantColor;
      }
    }
    return items;
  } catch (err) {
    console.log(err);
  }
};

export default async function Wallpaper() {
  await loginIsRequiredServer();
  const session = await getServerSession(authConfig);

  const [shortTermTracks, mediumTermTracks, longTermTracks] = await Promise.all(
    [
      getTopTrack('short_term', session),
      getTopTrack('medium_term', session),
      getTopTrack('long_term', session)
    ]
  );

  return (
    <div className="flex flex-col items-center p-6 bg-[#FFE818]">
      <SwiperWallpaper
        shortTermTracks={shortTermTracks || []}
        mediumTermTracks={mediumTermTracks || []}
        longTermTracks={longTermTracks || []}
      />
    </div>
  );
}
