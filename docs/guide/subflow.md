---
nav: 指南
title: 子流程
order: 1
group:
  title: 布局
  order: 3
---

## 子流程

:::info{title=注意}
弃用parentNode 属性！在版本 11.11.0 中，我们已将parentNode 选项重命名为parentId。旧属性仍然受支持，但将在版本 12 中删除。
:::

子流是节点内的流。它可以是单独的流，也可以是与其父级之外的其他节点连接的流。此功能还可用于对节点进行分组。在文档的这一部分中，我们将构建一个包含子流的流，并向您展示子节点的特定选项。

:::warning
节点顺序: 在 nodes/defaultNodes 数组中，父节点出现在其子节点之前是很重要的，这样才能正确处理。
:::

### 添加子节点

如果要将一个节点添加为另一个节点的子节点，则需要使用 `parentId`（在以前的版本中称为`parentNode`）选项（您可以在节点选项部分找到所有选项的列表）。一旦我们这样做了，子节点就会相对于其父节点定位。 `{ x: 0, y: 0 }` 的位置是父级的左上角。

在此示例中，我们通过传递 `style` 选项来设置父节点的固定宽度和高度。此外，我们将子范围设置为 “parent”，这样我们就无法将子节点移出父节点。

```tsx
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
} from '@xyflow/react';

const initialNodes = [
  {
    id: 'A',
    type: 'group',
    data: { label: null },
    position: { x: 0, y: 0 },
    style: {
      width: 170,
      height: 140,
    },
  },
  {
    id: 'B',
    type: 'input',
    data: { label: 'Dooring Node' },
    position: { x: 10, y: 10 },
    parentId: 'A',
    extent: 'parent',
  },
  {
    id: 'C',
    data: { label: 'React Flow' },
    position: { x: 10, y: 90 },
    parentId: 'A',
    extent: 'parent',
  },
];

const initialEdges = [
  { id: 'b-c', source: 'B', target: 'C' }
];

const rfStyle = {
  backgroundColor: '#D0C0F7',
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
    <div style={{width: '100%', height: '30vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={rfStyle}
        attributionPosition="top-right"
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

export default Flow;
```

### 使用子节点特定选项

当移动父节点时，我们可以看到子节点也移动。使用 `parentId` 选项将一个节点添加到另一个节点只做一件事：相对于其父节点定位它。子节点并不是真正的子标记。可以将子级拖动或定位到其父级之外（当未设置范围：'parent'选项时），但是当您移动父级时，子级也会随之移动。

在上面的示例中，我们使用组类型作为父节点，但您也可以使用任何其他类型。组类型只是一种没有附加句柄的便利节点类型。

现在我们要添加更多的节点和边。正如您所看到的，我们可以连接组内的节点并创建从子流到外部节点的连接：

```tsx
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
} from '@xyflow/react';

const initialNodes = [
  {
    id: 'A',
    type: 'group',
    position: { x: 0, y: 0 },
    style: {
      width: 170,
      height: 140,
    },
  },
  {
    id: 'A-1',
    type: 'input',
    data: { label: 'Child Node 1' },
    position: { x: 10, y: 10 },
    parentId: 'A',
    extent: 'parent',
  },
  {
    id: 'A-2',
    data: { label: 'Child Node 2' },
    position: { x: 10, y: 90 },
    parentId: 'A',
    extent: 'parent',
  },
  {
    id: 'B',
    type: 'output',
    position: { x: -100, y: 200 },
    data: { label: 'Node B' },
  },
  {
    id: 'C',
    type: 'output',
    position: { x: 100, y: 200 },
    data: { label: 'Node C' },
  },
];
const initialEdges = [
  { id: 'a1-a2', source: 'A-1', target: 'A-2' },
  { id: 'a2-b', source: 'A-2', target: 'B' },
  { id: 'a2-c', source: 'A-2', target: 'C' },
];

const rfStyle = {
  backgroundColor: '#D0C0F7',
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
    <div style={{width: '100%', height: '50vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={rfStyle}
        attributionPosition="top-right"
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

export default Flow;
```

### 使用默认节点作为父元素

让我们删除节点 B 的标签并添加一些子节点。在此示例中，可以看到我们也可以使用默认节点类型之一作为父节点。我们还将子节点设置为`draggable: false`，以便它们不再可拖动。

```tsx
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
} from '@xyflow/react';

const initialNodes = [
  {
    id: 'A',
    type: 'group',
    position: { x: 0, y: 0 },
    style: {
      width: 170,
      height: 140,
    },
  },
  {
    id: 'A-1',
    type: 'input',
    data: { label: 'Child Node 1' },
    position: { x: 10, y: 10 },
    parentId: 'A',
    extent: 'parent',
  },
  {
    id: 'A-2',
    data: { label: 'Child Node 2' },
    position: { x: 10, y: 90 },
    parentId: 'A',
    extent: 'parent',
  },
  {
    id: 'B',
    type: 'output',
    position: { x: -100, y: 200 },
    data: null,
    style: {
      width: 170,
      height: 140,
      backgroundColor: 'rgba(240,240,240,0.25)',
    },
  },
  {
    id: 'B-1',
    data: { label: 'Child 1' },
    position: { x: 50, y: 10 },
    parentId: 'B',
    extent: 'parent',
    draggable: false,
    style: {
      width: 60,
    },
  },
  {
    id: 'B-2',
    data: { label: 'Child 2' },
    position: { x: 10, y: 90 },
    parentId: 'B',
    extent: 'parent',
    // draggable: false,
    style: {
      width: 60,
    },
  },
  {
    id: 'B-3',
    data: { label: 'Child 3' },
    position: { x: 100, y: 90 },
    parentId: 'B',
    extent: 'parent',
    // draggable: false,
    style: {
      width: 60,
    },
  },
  {
    id: 'C',
    type: 'output',
    position: { x: 100, y: 200 },
    data: { label: 'Node C' },
  },
];
const initialEdges = [
  { id: 'a1-a2', source: 'A-1', target: 'A-2' },
  { id: 'a2-b', source: 'A-2', target: 'B' },
  { id: 'a2-c', source: 'A-2', target: 'C' },
  { id: 'b1-b2', source: 'B-1', target: 'B-2' },
  { id: 'b1-b3', source: 'B-1', target: 'B-3' },
];

const rfStyle = {
  backgroundColor: '#D0C0F7',
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
    <div style={{width: '100%', height: '50vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={rfStyle}
        attributionPosition="top-right"
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

export default Flow;
```

