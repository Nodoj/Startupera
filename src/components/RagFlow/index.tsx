"use client";

import { useCallback, useMemo, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
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
import { 
  FileText, 
  MessageSquare,
  Bot,
  Youtube,
  Zap
} from "lucide-react";
import { getDiagramConfig, getInitialEdges } from './flows';

// Custom Interactive Node Components
const InputNode = ({ data, selected }: any) => {
  const [inputValue, setInputValue] = useState(data.inputValue || '');
  
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4" />
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
  const IconComponent = data.icon;
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 min-w-[160px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <div className="flex items-center gap-2 mb-2">
        <div className="flex h-5 w-5 items-center justify-center">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <strong className="text-sm text-gray-800 dark:text-white">{data.label}</strong>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-gray-400" />
    </div>
  );
};

const OutputNode = ({ data, selected }: any) => {
  const [output, setOutput] = useState('AI Response will appear here...');
  
  // Check if this is the Image Generation flow
  const isImageFlow = data.label === 'Final Gallery';
  
  if (isImageFlow) {
    return (
      <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-gray-500 dark:bg-gray-dark dark:border-gray-600 bg-gray-light text-white min-w-[280px]">
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4" />
          <strong className="text-sm">{data.label}</strong>
        </div>
        
        {/* Image Gallery Mockup */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Generated Image Placeholders */}
          <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-md flex items-center justify-center">
            <span className="text-xs font-medium">Generated 1</span>
          </div>
          <div className="aspect-square bg-gradient-to-br from-blue-400 to-cyan-400 rounded-md flex items-center justify-center">
            <span className="text-xs font-medium">Generated 2</span>
          </div>
          <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-400 rounded-md flex items-center justify-center">
            <span className="text-xs font-medium">Generated 3</span>
          </div>
          <div className="aspect-square bg-gradient-to-br from-green-400 to-emerald-400 rounded-md flex items-center justify-center">
            <span className="text-xs font-medium">Generated 4</span>
          </div>
        </div>
        
        <div className="text-xs opacity-90 text-center">
          ✨ High-quality AI generated images
        </div>
      </div>
    );
  }
  
  // Default output node for other flows
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-green-500 bg-gradient-to-r from-green-500 to-green-600 text-white min-w-[200px]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white" />
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="h-4 w-4" />
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

// Flow configurations are now imported from separate files

const RagFlow = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentDiagram, setCurrentDiagram] = useState('rag');
  const [isCanvasActive, setIsCanvasActive] = useState(false);
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

  // Handle canvas interaction states
  const handleCanvasClick = useCallback(() => {
    setIsCanvasActive(true);
  }, []);

  const handleCanvasBlur = useCallback(() => {
    setIsCanvasActive(false);
  }, []);

  const handleCanvasMouseLeave = useCallback(() => {
    setIsCanvasActive(false);
  }, []);

  // Handle mouse enter to show interaction hint
  const handleCanvasMouseEnter = useCallback(() => {
    // Just for visual feedback, don't activate yet
  }, []);

  // Get diagram title based on current type
  const getDiagramTitle = () => {
    switch (currentDiagram) {
      case 'rag':
        return 'RAG AI Chatbots';
      case 'youtube':
        return 'YouTube Automation';
      case 'image':
        return 'AI Image Generation';
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
          title="Explore Our AI Solutions"
          paragraph="Interactive visualizations of our custom AI automation workflows. Click and explore how we build intelligent systems that transform your business processes with local deployment and enterprise security."
          center
          mb="50px"
        />

        <div className="relative">
          {/* Flow Container */}
          <div 
            className={`w-full h-[600px] bg-white dark:bg-gray-dark rounded-xl border shadow-lg overflow-hidden transition-all duration-200 ${
              isCanvasActive 
                ? 'border-primary ring-2 ring-primary/20 cursor-grab' 
                : 'border-stroke dark:border-stroke-dark cursor-grab hover:cursor-grab'
            }`}
            onClick={handleCanvasClick}
            onMouseEnter={handleCanvasMouseEnter}
            onMouseLeave={handleCanvasMouseLeave}
            tabIndex={0}
            onBlur={handleCanvasBlur}
          >
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
              defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              panOnDrag={isCanvasActive}
              zoomOnScroll={isCanvasActive}
              zoomOnPinch={true}
              className={`bg-transparent ${!isCanvasActive ? 'pointer-events-none' : ''}`}
            >
              {/* Diagram Switcher */}
              <Panel position="top-center">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentDiagram('rag')}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                        currentDiagram === 'rag'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Bot className="h-3 w-3" />
                      RAG Chatbot
                    </button>
                    <button
                      onClick={() => setCurrentDiagram('youtube')}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                        currentDiagram === 'youtube'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Youtube className="h-3 w-3" />
                      YouTube Automation
                    </button>
                    <button
                      onClick={() => setCurrentDiagram('image')}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors ${
                        currentDiagram === 'image'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Zap className="h-3 w-3" />
                      Image Generation
                    </button>
                  </div>
                </div>
              </Panel>
              <Controls 
                className="bg-white dark:bg-gray-800 border border-stroke dark:border-gray-600 rounded-lg shadow-lg"
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

          {/* Explore More Button */}
          <div className="mt-12 text-center">
            <Link
              href="/flows"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Explore More Automation Flows</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RagFlow;
