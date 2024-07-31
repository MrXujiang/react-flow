---
nav: 指南
title: 视口
order: 3
group:
  title: 概念&原理
  order: 1
---

## 平移和缩放

`React Flow` 的默认平移和缩放行为受到[滑动地图](https://wiki.openstreetmap.org/wiki/Slippy_map)的启发。我们可以通过拖动进行平移，通过滚动进行缩放。可以使用提供的属性轻松自定义此行为：

- panOnDrag: 默认: true
- selectionOnDrag: 默认: false (available since 11.4.0)
- panOnScroll: 默认: false (Overwrites zoomOnScroll)
- panOnScrollSpeed: 默认: 0.5
- panOnScrollMode: 默认: 'free'. 'free' (所有方向), 'vertical' (仅垂直) or - 'horizontal' (仅水平)
- zoomOnScroll: 默认: true
- zoomOnPinch: 默认: true
- zoomOnDoubleClick: 默认: true
- preventScrolling: 默认: true (阻止浏览器饿的滚动行为)
- zoomActivationKeyCode: 默认 'Meta'
- panActivationKeyCode: 默认 'Space'

## 默认视口控制

如上所述，默认控件是： 

- 平移：拖动鼠标 
- 缩放：滚动 
- 创建选择：Shift + 拖动


```tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

const initialNodes = [
  {
    id: '1',
    data: { label: 'Dooring' },
    position: { x: 150, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Nest-Admin' },
    position: { x: 0, y: 150 },
  },
  {
    id: '3',
    data: { label: 'Next-Admin' },
    position: { x: 300, y: 150 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div style={{width: '100%', height: '30vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
    
  );
}

export default Flow;
```

## 类似 Figma 的视口控件

如果你更喜欢 `Figma/sketch/design` 工具控件，可以设置`panOnScroll={true}`和`selectionOnDrag={true}`： 

- 平移：空格+拖动鼠标、滚动、鼠标中键或右键 
- 缩放：俯仰或 cmd + 滚动 
- 创建选区：拖动鼠标

```tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  SelectionMode,
} from '@xyflow/react';

const initialNodes = [
  {
    id: '1',
    data: { label: 'Dooring' },
    position: { x: 150, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Nest-Admin' },
    position: { x: 0, y: 150 },
  },
  {
    id: '3',
    data: { label: 'Next-Admin' },
    position: { x: 300, y: 150 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const panOnDrag = [1, 2];

  return (
    <div style={{width: '100%', height: '30vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        panOnScroll
        selectionOnDrag
        panOnDrag={panOnDrag}
        selectionMode={SelectionMode.Partial}
        fitView
      />
    </div>
    
  );
}

export default Flow;
```

在此示例中，我们还设置 `SelectionMode={SelectionMode.Partial}` 以便能够将节点添加到仅部分选择的选择中。



