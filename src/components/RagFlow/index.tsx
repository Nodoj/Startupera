"use client";

import React, { useCallback, useMemo, useEffect, useState } from 'react';
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

// Custom Interactive Node Components - Memoized for performance
const InputNode = React.memo(({ data, selected }: any) => {
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
});
InputNode.displayName = 'InputNode';

const ProcessNode = React.memo(({ data, selected }: any) => {
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
});
ProcessNode.displayName = 'ProcessNode';

const OutputNode = React.memo(({ data, selected }: any) => {
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
});
OutputNode.displayName = 'OutputNode';

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
  const [isMobile, setIsMobile] = useState(false);
  const isDark = resolvedTheme === 'dark';

  // Node types - memoized once
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

  // Update nodes and edges when theme or diagram changes - optimized
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const newNodes = getDiagramConfig(currentDiagram, isDark);
    const newEdges = getInitialEdges(isDark);
    
    // Always update when diagram type changes
    setNodes(newNodes as any);
    setEdges(newEdges);
  }, [currentDiagram, isDark, mounted, setNodes, setEdges]);

  // Detect if mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((prevEdges) => addEdge(params, prevEdges)),
    [setEdges],
  );

  // Memoized diagram metadata
  const diagramTitle = useMemo(() => {
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
  }, [currentDiagram]);

  const diagramDescription = useMemo(() => {
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
  }, [currentDiagram]);

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
          mb="44px"
        />

        <div className="relative">
          {/* Flow Container */}
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-lg overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              proOptions={proOptions}
              fitView
              fitViewOptions={{
                padding: isMobile ? 0.1 : 0.3,
                includeHiddenNodes: false,
              }}
              minZoom={isMobile ? 0.2 : 0.3}
              maxZoom={isMobile ? 1 : 2}
              defaultViewport={{ x: 0, y: 0, zoom: isMobile ? 0.4 : 0.8 }}
              nodesDraggable={!isMobile}
              nodesConnectable={false}
              elementsSelectable={!isMobile}
              panOnDrag={!isMobile}
              panOnScroll={false}
              zoomOnScroll={!isMobile}
              zoomOnPinch={!isMobile}
              zoomOnDoubleClick={false}
              preventScrolling={true}
              nodeOrigin={[0.5, 0.5]}
              selectNodesOnDrag={false}
              className="bg-transparent"
            >
              {/* Diagram Switcher */}
              <Panel position="top-center" className="!pointer-events-auto">
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark">
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    <button
                      onClick={() => setCurrentDiagram('rag')}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-[10px] sm:text-xs font-medium transition-colors ${
                        currentDiagram === 'rag'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Bot className="h-3 w-3 sm:h-3 sm:w-3" />
                      <span className="hidden xs:inline sm:inline">RAG Chatbot</span>
                      <span className="xs:hidden sm:hidden">RAG</span>
                    </button>
                    <button
                      onClick={() => setCurrentDiagram('youtube')}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-[10px] sm:text-xs font-medium transition-colors ${
                        currentDiagram === 'youtube'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Youtube className="h-3 w-3 sm:h-3 sm:w-3" />
                      <span className="hidden xs:inline sm:inline">YouTube</span>
                      <span className="xs:hidden sm:hidden">YT</span>
                    </button>
                    <button
                      onClick={() => setCurrentDiagram('image')}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded text-[10px] sm:text-xs font-medium transition-colors ${
                        currentDiagram === 'image'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Zap className="h-3 w-3 sm:h-3 sm:w-3" />
                      <span className="hidden xs:inline sm:inline">Image Gen</span>
                      <span className="xs:hidden sm:hidden">IMG</span>
                    </button>
                  </div>
                </div>
              </Panel>
              {/* Controls - Hidden on mobile */}
              {!isMobile && (
                <Controls 
                  className="bg-white dark:bg-gray-800 border border-stroke dark:border-gray-600 rounded-lg shadow-lg"
                  showZoom={true}
                  showFitView={true}
                  showInteractive={true}
                />
              )}
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={isMobile ? 15 : 20} 
                size={1} 
                color={isDark ? "#374151" : "#e2e8f0"}
              />
            </ReactFlow>
          </div>


          {/* Dynamic Legend */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-6 px-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-body-color dark:text-body-color-dark">Input</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-body-color dark:text-body-color-dark">Processing</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-body-color dark:text-body-color-dark">Output</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-transparent border-2 border-blue-500 rounded flex-shrink-0"></div>
              <span className="text-xs sm:text-sm text-body-color dark:text-body-color-dark">Flow</span>
            </div>
          </div>

          {/* Explore More Button */}
          <div className="mt-8 sm:mt-12 text-center px-4">
            <Link
              href="/flows"
              className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-primary text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <span className="hidden sm:inline">Explore More Automation Flows</span>
              <span className="sm:hidden">Explore Flows</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
