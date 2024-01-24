import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';

import { MusicWallpaper } from '@/components/MusicWallpaper';

import { authConfig, loginIsRequiredServer } from '@/lib/auth';
import { TopTrackService } from '@/services/http/topTrack';

const getTopTrack = async (session: Session | null) => {
  try {
    const items = await TopTrackService.getAll('short_term', session);
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
