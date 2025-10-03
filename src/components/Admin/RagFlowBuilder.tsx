'use client'

import { useState, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
  Connection,
  Panel,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Save, Download, Upload, Plus, Trash2, FileText, Workflow, Database, Zap } from 'lucide-react'

// Custom Node Components matching homepage style
const CustomNode = ({ data, selected }: any) => {
  const IconComponent = data.icon || Workflow
  const isInput = data.type === 'Input'
  const isOutput = data.type === 'Output'
  
  return (
    <div 
      className={`px-4 py-3 shadow-lg rounded-lg border-2 min-w-[160px] transition-all duration-200 ${
        selected 
          ? 'ring-2 ring-primary ring-offset-2' 
          : ''
      } ${
        isInput 
          ? 'border-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          : isOutput
          ? 'border-green-500 bg-gradient-to-r from-green-500 to-green-600 text-white'
          : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'
      }`}
    >
      {!isInput && (
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
      
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center">
          <IconComponent className={`h-4 w-4 ${isInput || isOutput ? 'text-white' : 'text-primary'}`} />
        </div>
        <strong className={`text-sm ${isInput || isOutput ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
          {data.label}
        </strong>
      </div>
      
      {!isOutput && (
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 bg-gray-400 border-2 border-white"
        />
      )}
    </div>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

interface RagFlowBuilderProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onSave?: (nodes: Node[], edges: Edge[]) => void
}

const RagFlowBuilder = ({ 
  initialNodes = [], 
  initialEdges = [], 
  onSave,
}: RagFlowBuilderProps) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  )

  const getNodeIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      'Input': FileText,
      'Output': FileText,
      'Database': Database,
      'API Call': Zap,
      'Process': Workflow,
      'Decision': Workflow,
      'Transform': Workflow,
      'Validation': Workflow,
      'Error Handler': Workflow,
      'Notification': Workflow,
      'Integration': Workflow,
      'Custom Node': Workflow,
    }
    return iconMap[type] || Workflow
  }

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { 
        x: 100 + Math.random() * 300, 
        y: 100 + Math.random() * 300 
      },
      data: { 
        label: type,
        type: type,
        icon: getNodeIcon(type),
      },
    }
    setNodes((nds) => [...nds, newNode])
  }

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id))
      setSelectedNode(null)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges)
    }
  }

  const exportFlow = () => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(flowData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `flow-diagram-${Date.now()}.json`
    link.click()
  }

  const importFlow = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target?.result as string)
          setNodes(flowData.nodes || [])
          setEdges(flowData.edges || [])
        } catch (error) {
          alert('Invalid flow file')
        }
      }
      reader.readAsText(file)
    }
  }

  // Generic node types for all flows
  const genericNodeTypes = [
    'Input',
    'Process',
    'Decision',
    'API Call',
    'Database',
    'Transform',
    'Validation',
    'Output',
    'Error Handler',
    'Notification',
    'Integration',
    'Custom Node',
  ]

  const defaultEdgeOptions = {
    animated: true,
    style: { stroke: '#4A6CF7', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#4A6CF7',
    },
  }

  return (
    <div className="h-[700px] w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNode(node)}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background gap={16} size={1} />
        <Controls />
        
        {/* Top Toolbar */}
        <Panel position="top-left" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 m-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
              title="Save diagram to form (not database)"
            >
              <Save className="h-4 w-4" />
              <span>Update Diagram</span>
            </button>
            
            <button
              onClick={exportFlow}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            
            <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importFlow}
                className="hidden"
              />
            </label>

            {selectedNode && (
              <button
                onClick={deleteSelectedNode}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Node</span>
              </button>
            )}
          </div>
        </Panel>

        {/* Node Palette */}
        <Panel position="top-right" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 m-4 border border-gray-200 dark:border-gray-700 max-w-xs">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Add Nodes</h3>
          <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto">
            {genericNodeTypes.map((type) => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-primary/10 to-blue-600/10 text-primary dark:text-blue-400 rounded-lg hover:from-primary/20 hover:to-blue-600/20 transition-all duration-200 text-xs font-medium border border-primary/20 dark:border-blue-700/30"
              >
                <Plus className="h-3 w-3" />
                <span className="truncate">{type}</span>
              </button>
            ))}
          </div>
        </Panel>

        {/* Info Panel */}
        <Panel position="bottom-left" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 m-4 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p><strong>Nodes:</strong> {nodes.length}</p>
            <p><strong>Connections:</strong> {edges.length}</p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default RagFlowBuilder
