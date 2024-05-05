import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';

import { MusicWallpaper } from '@/components/MusicWallpaper';

import { authConfig, loginIsRequiredServer } from '@/lib/auth';
import { extractDominantColor } from '@/lib/extractDominantColor';
import { TopTrackService } from '@/services/http/topTrack';

const getTopTrack = async (session: Session | null) => {
  try {
    const items = (await TopTrackService.getAll('short_term', session)) ?? [];
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

  const topTrack = await getTopTrack(session);

  return (
    <div className="flex flex-col items-center p-6">
      {topTrack && <MusicWallpaper tracks={topTrack} />}
    </div>
  );
}
