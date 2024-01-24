import { MySessionProps, ReturnTrackProps } from './types';

import api from '@/services/api';
import axios from 'axios';

export const TopTrackService = {
  getAll: async function (
    timeRange: 'long_term' | 'medium_term' | 'short_term',
    session: MySessionProps | null
  ) {
    try {
      const response = await api.get<ReturnTrackProps>(
        `me/top/tracks?time_range=${timeRange}&limit=16&offset=0`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`
          }
        }
      );
      return response.data.items;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        throw new Error(`Status: ${err.response.status} - ${err.message}`);
      }
    }
  }
};
