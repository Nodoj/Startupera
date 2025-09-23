import { Position } from 'reactflow';
import { 
  Sparkles,
  Palette,
  Bot,
  Settings,
  CheckCircle
} from "lucide-react";

export const getImageNodes = (isDark: boolean) => [
  {
    id: '1',
    type: 'inputNode',
    data: { label: 'Text Prompt', inputValue: '' },
    position: { x: 0, y: 100 },
    sourcePosition: Position.Right,
    draggable: false,
  },
  {
    id: '2',
    type: 'processNode',
    data: { label: 'Prompt Enhancement', icon: Sparkles },
    position: { x: 250, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: '3',
    type: 'processNode',
    data: { label: 'Style Selection', icon: Palette },
    position: { x: 450, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: '4',
    type: 'processNode',
    data: { label: 'AI Generation', icon: Bot },
    position: { x: 450, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: '5',
    type: 'processNode',
    data: { label: 'Image Processing', icon: Settings },
    position: { x: 650, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: '6',
    type: 'processNode',
    data: { label: 'Quality Check', icon: CheckCircle },
    position: { x: 850, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: '7',
    type: 'outputNode',
    data: { label: 'Final Image' },
    position: { x: 1050, y: 100 },
    targetPosition: Position.Left,
    draggable: false,
  },
];
