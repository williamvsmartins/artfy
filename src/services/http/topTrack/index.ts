import { MySessionProps, ReturnTrackProps } from './types';

import { extractDominantColor } from '@/lib/extractDominantColor';
import api from '@/services/api';
import axios from 'axios';

export const TopTrackService = {
  getAll: async function (timeRange: string, session: MySessionProps | null) {
    try {
      const response = await api.get<ReturnTrackProps>(
        `me/top/tracks?time_range=${timeRange}&limit=16&offset=0`,
        {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`
          }
        }
      );
      const items = response.data.items;
      const promises = items.map((item) => {
        if (item.album.images && item.album.images.length > 0) {
          const imageUrl = item.album.images[0].url as string;
          return extractDominantColor(imageUrl);
        }
      });

      const dominantColors = await Promise.all(promises);

      items.forEach((item, index) => {
        item.dominantColor = dominantColors[index] ?? '';
      });

      return items;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        throw new Error(`Status: ${err.response.status} - ${err.message}`);
      }
    }
  }
};
