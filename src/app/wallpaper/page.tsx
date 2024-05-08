import { getServerSession } from 'next-auth';

import { SwiperWallpaper } from '@/components/SwiperWallpaper';

import { authConfig, loginIsRequiredServer } from '@/lib/auth';
import { TopTrackService } from '@/services/http/topTrack';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate
} from '@tanstack/react-query';

export default async function Wallpaper() {
  await loginIsRequiredServer();
  const session = await getServerSession(authConfig);

  const queryClient = new QueryClient();

  const periods = ['short_term', 'medium_term', 'long_term'];

  await Promise.all(
    periods.map((period) =>
      queryClient.prefetchQuery({
        queryKey: ['topTracks', period],
        queryFn: () => TopTrackService.getAll(period, session)
      })
    )
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-[#FFE818]">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SwiperWallpaper session={session} />
      </HydrationBoundary>
    </div>
  );
}
