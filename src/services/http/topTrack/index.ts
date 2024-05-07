import { MySessionProps, ReturnTrackProps } from './types';

import { extractDominantColors } from '@/lib/extractDominantColor';
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
      const imageUrls = items
        .filter(
          (item) =>
            item.album && item.album.images && item.album.images.length > 0
        )
        .map((item) => item.album.images![0].url as string);

      const dominantColors = await extractDominantColors(imageUrls);

      items.forEach((item, index) => {
        if (item.album.images && item.album.images.length > 0) {
          item.dominantColor = dominantColors[index];
        }
      });
      return items;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        throw new Error(`Status: ${err.response.status} - ${err.message}`);
      }
    }
  }
};
