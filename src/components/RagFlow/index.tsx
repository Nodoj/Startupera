"use client";

import { useCallback, useMemo, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  MarkerType,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './ragflow.css';
import SectionTitle from "../Common/SectionTitle";

// Custom Interactive Node Components
const InputNode = ({ data, selected }: any) => {
  const [inputValue, setInputValue] = useState(data.inputValue || '');
  
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">📄</span>
        <strong className="text-sm">{data.label}</strong>
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter document..."
        className="w-full px-2 py-1 text-xs text-black rounded nodrag"
      />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white" />
    </div>
  );
};

const ProcessNode = ({ data, selected }: any) => {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 min-w-[160px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{data.icon}</span>
        <strong className="text-sm text-gray-800 dark:text-white">{data.label}</strong>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
    </div>
  );
};

const OutputNode = ({ data, selected }: any) => {
  const [output, setOutput] = useState('AI Response will appear here...');
  
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-green-500 bg-gradient-to-r from-green-500 to-green-600 text-white min-w-[200px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">💬</span>
        <strong className="text-sm">{data.label}</strong>
      </div>
      <textarea
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        className="w-full px-2 py-1 text-xs text-black rounded nodrag resize-none"
        rows={3}
      />
    </div>
  );
};

// Custom node styles with theme support
const getNodeStyles = (isDark: boolean) => ({
  input: {
    background: '#4A6CF7',
    color: 'white',
    border: '2px solid #4A6CF7',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px 16px',
    boxShadow: isDark 
      ? '0 4px 20px rgba(74, 108, 247, 0.4), 0 0 0 1px rgba(74, 108, 247, 0.2)' 
      : '0 4px 12px rgba(74, 108, 247, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'grab',
  },
  default: {
    background: isDark ? '#1F2937' : 'white',
    color: isDark ? '#F9FAFB' : '#1a202c',
    border: isDark ? '2px solid #374151' : '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    padding: '12px 16px',
    boxShadow: isDark 
      ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    cursor: 'grab',
  },
  output: {
    background: '#10B981',
    color: 'white',
    border: '2px solid #10B981',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px 16px',
    boxShadow: isDark 
      ? '0 4px 20px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.2)' 
      : '0 4px 12px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'grab',
  },
});

// Different diagram configurations
const getDiagramConfig = (type: string, isDark: boolean) => {
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

const getRagNodes = (isDark: boolean) => [
  // Left-to-right horizontal flow
  {
    id: '1',
    type: 'inputNode',
    data: { label: 'Document Input', inputValue: '' },
    position: { x: 0, y: 100 },
    sourcePosition: Position.Right,
    draggable: true,
  },
  {
    id: '2',
    type: 'processNode',
    data: { label: 'Text Extraction', icon: '🔍' },
    position: { x: 250, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '3',
    type: 'processNode',
    data: { label: 'Text Chunking', icon: '✂️' },
    position: { x: 250, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '4',
    type: 'processNode',
    data: { label: 'Embedding Gen', icon: '🧠' },
    position: { x: 450, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '5',
    type: 'processNode',
    data: { label: 'Vector Database', icon: '🗄️' },
    position: { x: 650, y: 100 },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '6',
    type: 'inputNode',
    data: { label: 'User Query', inputValue: '' },
    position: { x: 0, y: 300 },
    sourcePosition: Position.Right,
    draggable: true,
  },
  {
    id: '7',
    type: 'processNode',
    data: { label: 'Query Processing', icon: '🔍' },
    position: { x: 250, y: 300 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '8',
    type: 'processNode',
    data: { label: 'Similarity Search', icon: '🎯' },
    position: { x: 650, y: 250 },
    sourcePosition: Position.Right,
    targetPosition: Position.Top,
    draggable: true,
  },
  {
    id: '9',
    type: 'processNode',
    data: { label: 'Context Retrieval', icon: '📋' },
    position: { x: 450, y: 300 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '10',
    type: 'processNode',
    data: { label: 'LLM Processing', icon: '🤖' },
    position: { x: 850, y: 250 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '11',
    type: 'outputNode',
    data: { label: 'AI Response' },
    position: { x: 1050, y: 200 },
    targetPosition: Position.Left,
    draggable: true,
  },
];

const getYoutubeNodes = (isDark: boolean) => [
  {
    id: '1',
    type: 'inputNode',
    data: { label: 'Video Topic', inputValue: '' },
    position: { x: 0, y: 100 },
    sourcePosition: Position.Right,
    draggable: true,
  },
  {
    id: '2',
    type: 'processNode',
    data: { label: 'Script Generation', icon: '📝' },
    position: { x: 250, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '3',
    type: 'processNode',
    data: { label: 'Voice Synthesis', icon: '🎤' },
    position: { x: 450, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '4',
    type: 'processNode',
    data: { label: 'Image Generation', icon: '🎨' },
    position: { x: 450, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '5',
    type: 'processNode',
    data: { label: 'Video Editing', icon: '🎬' },
    position: { x: 650, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '6',
    type: 'processNode',
    data: { label: 'Thumbnail Gen', icon: '🖼️' },
    position: { x: 850, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '7',
    type: 'processNode',
    data: { label: 'YouTube Upload', icon: '📤' },
    position: { x: 850, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '8',
    type: 'outputNode',
    data: { label: 'Published Video' },
    position: { x: 1050, y: 100 },
    targetPosition: Position.Left,
    draggable: true,
  },
];

const getImageNodes = (isDark: boolean) => [
  {
    id: '1',
    type: 'inputNode',
    data: { label: 'Text Prompt', inputValue: '' },
    position: { x: 0, y: 100 },
    sourcePosition: Position.Right,
    draggable: true,
  },
  {
    id: '2',
    type: 'processNode',
    data: { label: 'Prompt Enhancement', icon: '✨' },
    position: { x: 250, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '3',
    type: 'processNode',
    data: { label: 'Style Selection', icon: '🎨' },
    position: { x: 450, y: 50 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '4',
    type: 'processNode',
    data: { label: 'AI Generation', icon: '🤖' },
    position: { x: 450, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '5',
    type: 'processNode',
    data: { label: 'Image Processing', icon: '🔧' },
    position: { x: 650, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '6',
    type: 'processNode',
    data: { label: 'Quality Check', icon: '✅' },
    position: { x: 850, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  },
  {
    id: '7',
    type: 'outputNode',
    data: { label: 'Final Image' },
    position: { x: 1050, y: 100 },
    targetPosition: Position.Left,
    draggable: true,
  },
];

const getInitialEdges = (isDark: boolean) => [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    style: { 
      stroke: '#4A6CF7', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
      animation: 'dash 2s linear infinite',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    style: { 
      stroke: '#4A6CF7', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    style: { 
      stroke: '#4A6CF7', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    style: { 
      stroke: '#4A6CF7', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#4A6CF7' },
    animated: true,
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    type: 'smoothstep',
    style: { 
      stroke: '#10B981', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  {
    id: 'e7-9',
    source: '7',
    target: '9',
    type: 'smoothstep',
    style: { 
      stroke: '#10B981', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  {
    id: 'e5-8',
    source: '5',
    target: '8',
    type: 'smoothstep',
    style: { 
      stroke: isDark ? '#9CA3AF' : '#6B7280', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? '#9CA3AF' : '#6B7280' },
    animated: true,
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    type: 'smoothstep',
    style: { 
      stroke: isDark ? '#9CA3AF' : '#6B7280', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: isDark ? '#9CA3AF' : '#6B7280' },
    animated: true,
  },
  {
    id: 'e9-10',
    source: '9',
    target: '10',
    type: 'smoothstep',
    style: { 
      stroke: '#10B981', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
  {
    id: 'e10-11',
    source: '10',
    target: '11',
    type: 'smoothstep',
    style: { 
      stroke: '#10B981', 
      strokeWidth: 3,
      strokeDasharray: '5,5',
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
    animated: true,
  },
];

const RagFlow = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentDiagram, setCurrentDiagram] = useState('rag');
  const isDark = resolvedTheme === 'dark';

  // Node types
  const nodeTypes = useMemo(() => ({
    inputNode: InputNode,
    processNode: ProcessNode,
    outputNode: OutputNode,
  }), []);

  // Initialize nodes and edges with theme and diagram type
  const initialNodes = useMemo(() => getDiagramConfig(currentDiagram, isDark), [currentDiagram, isDark]);
  const initialEdges = useMemo(() => getInitialEdges(isDark), [isDark]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when theme changes
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const newNodes = getDiagramConfig(currentDiagram, isDark);
      const newEdges = getInitialEdges(isDark);
      
      setNodes(newNodes as any);
      setEdges(newEdges);
    }
  }, [currentDiagram, isDark, mounted, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Handle node selection for highlighting
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    console.log('Node clicked:', node.data.label);
    // Add visual feedback for node interaction
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, [setNodes]);

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: any) => {
    console.log('Edge clicked:', edge.id);
    // Add visual feedback for edge interaction
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        selected: e.id === edge.id,
      }))
    );
  }, [setEdges]);

  // Get diagram title based on current type
  const getDiagramTitle = () => {
    switch (currentDiagram) {
      case 'rag':
        return 'RAG AI Chatbot Architecture';
      case 'youtube':
        return 'YouTube Automation Workflow';
      case 'image':
        return 'AI Image Generation Pipeline';
      default:
        return 'AI Automation Architecture';
    }
  };

  const getDiagramDescription = () => {
    switch (currentDiagram) {
      case 'rag':
        return 'Discover how our Retrieval-Augmented Generation system processes your documents and delivers intelligent, context-aware responses through advanced AI technology.';
      case 'youtube':
        return 'Explore the complete automation pipeline for creating YouTube videos from topic to publication, including script generation, voice synthesis, and automated uploading.';
      case 'image':
        return 'Understand the AI-powered image generation workflow from text prompts to high-quality visual outputs with style selection and quality assurance.';
      default:
        return 'Interactive visualization of AI automation workflows and architectures.';
    }
  };

  const proOptions = { hideAttribution: true };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <section id="ragflow" className="dark:bg-bg-color-dark bg-gray-light py-16 md:py-20 lg:py-28">
        <div className="container">
        <SectionTitle
          title={getDiagramTitle()}
          paragraph={getDiagramDescription()}
          center
          mb="80px"
        />

        <div className="relative">
          {/* Flow Container */}
          <div className="w-full h-[600px] bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-lg overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              proOptions={proOptions}
              fitView
              fitViewOptions={{
                padding: 0.3,
                includeHiddenNodes: false,
              }}
              minZoom={0.3}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              className="bg-transparent"
            >
              {/* Diagram Switcher */}
              <Panel position="top-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentDiagram('rag')}
                      className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                        currentDiagram === 'rag'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      🤖 RAG Chatbot
                    </button>
                    <button
                      onClick={() => setCurrentDiagram('youtube')}
                      className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                        currentDiagram === 'youtube'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      📺 YouTube Automation
                    </button>
                    <button
                      onClick={() => setCurrentDiagram('image')}
                      className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                        currentDiagram === 'image'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      🎨 Image Generation
                    </button>
                  </div>
                </div>
              </Panel>
              <Controls 
                className="bg-white dark:bg-gray-dark border border-stroke dark:border-stroke-dark rounded-lg shadow-lg"
                showZoom={true}
                showFitView={true}
                showInteractive={true}
              />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1} 
                color={isDark ? "#374151" : "#e2e8f0"}
              />
            </ReactFlow>
          </div>

          {/* Dynamic Legend */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-body-color dark:text-body-color-dark">Input Nodes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-body-color dark:text-body-color-dark">Processing Steps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-body-color dark:text-body-color-dark">Output Results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-transparent border-2 border-blue-500 rounded"></div>
              <span className="text-sm text-body-color dark:text-body-color-dark">Animated Flow</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RagFlow;
