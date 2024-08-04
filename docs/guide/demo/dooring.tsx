import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  SelectionMode,
  MiniMap,
  Controls,
  Background,
  Panel
} from '@xyflow/react';
import { Button } from 'antd';
import { TextUpdaterNode, LogoNode, BaseNode, ImgNode } from './components/Nodes';
import { CustomEdge } from './components/Edges';
import { initialEdges, initialNodes } from './components/data';

const handleStyle = { left: 10 };
const panOnDrag = [1, 2];

const rfStyle = {
  backgroundColor: '#f7f9fb',
};

const nodeTypes = { 
  textUpdater: TextUpdaterNode, 
  logo: LogoNode,
  base: BaseNode,
  img: ImgNode
};

const edgeTypes = {
  'custom-edge': CustomEdge,
};

const nodeColor = (node) => {
  switch (node.type) {
    case 'base':
      return '#6ede87';
    case 'img':
      return '#1890ff';
    default:
      return '#ff0072';
  }
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div style={{width: '100%', height: '90vh'}}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            panOnScroll
            selectionOnDrag
            panOnDrag={panOnDrag}
            selectionMode={SelectionMode.Partial}
            fitView
            style={rfStyle}
        >
            <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
            <Controls />
            <Background color="#ccc" variant="dots" />
            <Panel position="top-right">
              
            </Panel>
        </ReactFlow>
    </div>
  );
}

export default Flow;