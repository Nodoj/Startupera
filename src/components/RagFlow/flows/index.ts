// Export all flow configurations from a single entry point
import { getRagNodes } from './ragFlow';
import { getYoutubeNodes } from './youtubeFlow';
import { getImageNodes } from './imageFlow';

export { getRagNodes, getYoutubeNodes, getImageNodes };
export { getInitialEdges } from './edgeConfigs';

// Flow configuration helper with static imports
export const getDiagramConfig = (type: string, isDark: boolean) => {
  switch (type) {
    case 'rag':
      return getRagNodes(isDark);
    case 'youtube':
      return getYoutubeNodes(isDark);
    case 'image':
      return getImageNodes(isDark);
    default:
      return getRagNodes(isDark);
  }
};
