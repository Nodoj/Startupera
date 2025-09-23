import { MarkerType } from 'reactflow';

export const getInitialEdges = (isDark: boolean) => [
  // Document Processing Pipeline
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    style: { stroke: '#4A6CF7', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    style: { stroke: '#4A6CF7', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    style: { stroke: '#4A6CF7', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    style: { stroke: '#4A6CF7', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  
  // Text Processing Pipeline
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    style: { stroke: '#8B5CF6', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' },
    animated: true,
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    type: 'smoothstep',
    style: { stroke: '#8B5CF6', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' },
    animated: true,
  },
  
  // Storage Pipeline
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smoothstep',
    style: { stroke: '#F59E0B', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
    animated: true,
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    type: 'smoothstep',
    style: { stroke: '#F59E0B', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' },
    animated: true,
  },
  
  // Query Processing Pipeline
  {
    id: 'e10-11',
    source: '10',
    target: '11',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  {
    id: 'e11-12',
    source: '11',
    target: '12',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  
  // Retrieval Pipeline
  {
    id: 'e12-13',
    source: '12',
    target: '13',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  {
    id: 'e13-14',
    source: '13',
    target: '14',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  {
    id: 'e14-15',
    source: '14',
    target: '15',
    type: 'smoothstep',
    style: { stroke: '#10B981', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  
  // Final Processing
  {
    id: 'e15-16',
    source: '15',
    target: '16',
    type: 'smoothstep',
    style: { stroke: '#EF4444', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    animated: true,
  },
  {
    id: 'e16-17',
    source: '16',
    target: '17',
    type: 'smoothstep',
    style: { stroke: '#EF4444', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    animated: true,
  },
  {
    id: 'e17-18',
    source: '17',
    target: '18',
    type: 'smoothstep',
    style: { stroke: '#EF4444', strokeWidth: 3, strokeDasharray: '5,5' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
    animated: true,
  },
  
  // Cross-connections (Vector DB to Similarity Search)
  {
    id: 'e9-13',
    source: '9',
    target: '13',
    type: 'smoothstep',
    style: { stroke: isDark ? '#9CA3AF' : '#6B7280', strokeWidth: 2, strokeDasharray: '3,3' },
    markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? '#9CA3AF' : '#6B7280' },
    animated: false,
  },
];
