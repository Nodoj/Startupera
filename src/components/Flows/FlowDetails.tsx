"use client";

import { Flow } from "@/types/flow";
import Image from "next/image";
import { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Clock, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Workflow,
  ArrowRight,
  Share2,
  BookOpen,
  Code,
  Users
} from "lucide-react";

// Custom Node Components
const CustomNode = ({ data, selected }: any) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-white dark:bg-gray-800 min-w-[160px] ${
    selected ? 'border-primary' : 'border-gray-300 dark:border-gray-600'
  }`}>
    <div className="flex items-center justify-center">
      <strong className="text-sm text-gray-800 dark:text-white text-center">{data.label}</strong>
    </div>
  </div>
);

const InputNode = ({ data, selected }: any) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-blue-50 dark:bg-blue-900/20 min-w-[160px] ${
    selected ? 'border-blue-600' : 'border-blue-400'
  }`}>
    <div className="flex items-center justify-center">
      <strong className="text-sm text-blue-800 dark:text-blue-200 text-center">{data.label}</strong>
    </div>
  </div>
);

const OutputNode = ({ data, selected }: any) => (
  <div className={`px-4 py-3 shadow-lg rounded-lg border-2 bg-green-50 dark:bg-green-900/20 min-w-[160px] ${
    selected ? 'border-green-600' : 'border-green-400'
  }`}>
    <div className="flex items-center justify-center">
      <strong className="text-sm text-green-800 dark:text-green-200 text-center">{data.label}</strong>
    </div>
  </div>
);

const FlowDetails = ({ flow }: { flow: Flow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.flowData?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.flowData?.edges || []);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({
    default: CustomNode,
    input: InputNode,
    output: OutputNode,
  }), []);

  const proOptions = { hideAttribution: true };

  return (
    <section className="pb-[120px] pt-[120px]">
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div className="shadow-one dark:bg-dark relative overflow-hidden rounded-md bg-white p-8 sm:p-11 md:p-8 xl:p-11">
              
              {/* Flow Header */}
              <div className="mb-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white">
                      {flow.tags[0]}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm">
                      <Zap className="mr-1 h-3 w-3" />
                      <span className="text-blue-700 dark:text-blue-300">{flow.complexity}</span>
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm">
                      <Clock className="mr-1 h-3 w-3" />
                      <span className="text-green-700 dark:text-green-300">{flow.timeToImplement}</span>
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      <span className="text-purple-700 dark:text-purple-300">{flow.roi}</span>
                    </span>
                  </div>
                  
                  <button className="inline-flex items-center gap-2 rounded-lg border border-stroke dark:border-stroke-dark px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <Share2 className="h-4 w-4" />
                    Share Flow
                  </button>
                </div>

                <h1 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  {flow.title}
                </h1>
                
                <div className="mb-6 flex items-center">
                  <div className="mr-5 flex items-center border-r border-body-color/10 pr-5 dark:border-white/10">
                    <div className="mr-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image src={flow.author.image} alt="author" fill />
                      </div>
                    </div>
                    <div className="w-full">
                      <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                        By {flow.author.name}
                      </h4>
                      <p className="text-xs text-body-color">{flow.author.designation}</p>
                    </div>
                  </div>
                  <div className="inline-block">
                    <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                      Published
                    </h4>
                    <p className="text-xs text-body-color">{flow.publishDate}</p>
                  </div>
                </div>

                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  {flow.paragraph}
                </p>
              </div>

              {/* ReactFlow Visualization */}
              <div className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
                  <Workflow className="h-6 w-6 text-primary" />
                  Automation Workflow
                </h2>
                <div className="h-[500px] w-full rounded-lg border border-stroke dark:border-stroke-dark bg-gray-50 dark:bg-gray-900">
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
                      padding: 0.2,
                    }}
                    minZoom={0.5}
                    maxZoom={1.5}
                    defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                    className="bg-transparent"
                  >
                    <Controls 
                      className="bg-white dark:bg-gray-dark border border-stroke dark:border-stroke-dark rounded-lg shadow-lg"
                    />
                    <MiniMap 
                      className="bg-white dark:bg-gray-dark border border-stroke dark:border-stroke-dark rounded-lg"
                      nodeColor="#4A6CF7"
                    />
                    <Background 
                      variant={BackgroundVariant.Dots} 
                      gap={20} 
                      size={1} 
                      color="#e2e8f0"
                    />
                  </ReactFlow>
                </div>
                <p className="mt-2 text-sm text-body-color dark:text-body-color-dark">
                  Interactive workflow diagram - you can zoom, pan, and explore the automation process
                </p>
              </div>

              {/* Technologies Used */}
              <div className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
                  <Code className="h-6 w-6 text-primary" />
                  Technologies & Stack
                </h2>
                <div className="flex flex-wrap gap-2">
                  {flow.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Implementation Details */}
              <div className="mb-8">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Implementation Overview
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-stroke dark:border-stroke-dark p-6">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Business Challenge
                    </h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      Traditional manual processes are time-consuming, error-prone, and don&apos;t scale with business growth. 
                      This leads to inefficiencies, increased costs, and missed opportunities in today&apos;s competitive market.
                    </p>
                  </div>

                  <div className="rounded-lg border border-stroke dark:border-stroke-dark p-6">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-black dark:text-white">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Our Solution
                    </h3>
                    <p className="text-body-color dark:text-body-color-dark">
                      AI-powered automation system that intelligently handles complex workflows, learns from patterns, 
                      and continuously optimizes performance while maintaining high accuracy and reliability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="mb-8">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Key Benefits & ROI
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-start gap-3 rounded-lg border border-stroke dark:border-stroke-dark p-4">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Efficiency Boost</h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark">
                        80-90% reduction in processing time
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 rounded-lg border border-stroke dark:border-stroke-dark p-4">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Cost Reduction</h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark">
                        Significant operational cost savings
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 rounded-lg border border-stroke dark:border-stroke-dark p-4">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">24/7 Operation</h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark">
                        Continuous automated processing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 rounded-lg border border-stroke dark:border-stroke-dark p-4">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Scalability</h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark">
                        Handles growing workloads seamlessly
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 rounded-lg border border-stroke dark:border-stroke-dark p-4">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Accuracy</h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark">
                        95%+ accuracy with continuous learning
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 rounded-lg border border-stroke dark:border-stroke-dark p-4">
                    <CheckCircle className="mt-1 h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">Integration</h4>
                      <p className="text-sm text-body-color dark:text-body-color-dark">
                        Seamless integration with existing systems
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="rounded-lg bg-primary/5 p-8 text-center">
                <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                  Ready to Implement This Automation?
                </h3>
                <p className="mb-6 text-body-color dark:text-body-color-dark">
                  Let&apos;s discuss how we can customize this solution for your specific business needs and requirements.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary/90">
                    <Users className="h-4 w-4" />
                    Schedule Consultation
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-stroke dark:border-stroke-dark px-6 py-3 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                    <ArrowRight className="h-4 w-4" />
                    View More Flows
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlowDetails;
