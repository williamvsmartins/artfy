import { Session } from 'next-auth';

import { TopTrackService } from '@/services/http/topTrack';
import { useQueries } from '@tanstack/react-query';

export function useTopTracks(session: Session | null) {
  const periods = ['short_term', 'medium_term', 'long_term'];

  const results = useQueries({
    queries: periods.map((period) => ({
      queryKey: ['topTracks', period],
      queryFn: () => TopTrackService.getAll(period, session)
    }))
  });

  return results;
}
