// Export all flow configurations from a single entry point
export { getRagNodes } from './ragFlow';
export { getYoutubeNodes } from './youtubeFlow';
export { getImageNodes } from './imageFlow';
export { getInitialEdges } from './edgeConfigs';

// Flow configuration helper
export const getDiagramConfig = (type: string, isDark: boolean) => {
  switch (type) {
    case 'rag':
      return require('./ragFlow').getRagNodes(isDark);
    case 'youtube':
      return require('./youtubeFlow').getYoutubeNodes(isDark);
    case 'image':
      return require('./imageFlow').getImageNodes(isDark);
    default:
      return require('./ragFlow').getRagNodes(isDark);
  }
};
