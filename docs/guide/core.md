---
nav: 指南
title: 核心概念
order: 2
group:
  title: 概念&原理
  order: 1
---

## 核心概念

在下面的部分中，我将介绍 `React Flow` 的核心概念，并解释如何创建交互式流程。

流由节点和边（或仅节点）组成。我们可以将节点和边数组作为 `props` 传递给 `ReactFlow` 组件。因此，所有节点和边缘 ID 都必须是唯一的。节点需要一个位置和一个标签（如果您使用自定义节点，这可能会有所不同），而边缘需要源（节点 id）和目标（节点 id）。我们可以在节点选项和边缘选项部分中阅读有关选项的更多信息。

### 受控与非受控

使用 `React Flow`，我们有两种设置流程的方法。我们可以创建受控或非受控的。建议使用受控流，但对于更简单的用例，我们也可以设置不受控流。在接下来的部分中，我们将设置受控流。让我们首先向 `ReactFlow` 组件添加一些节点和边：

```tsx
import { useState } from 'react';
import { ReactFlow } from '@xyflow/react';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Dooring Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  return <div style={{width: '100%', height: '30vh'}}><ReactFlow nodes={nodes} edges={edges} fitView /></div>;
}

export default Flow;
```

### 基础能力

默认情况下，除了在设置受控流时处理视口之外，`React Flow` 不会执行任何内部状态更新。与
组件一样，我们需要传递处理程序以将 `React Flow` 触发的更改应用到节点和边。为了选择、拖动和删除节点和边，我们需要实现 `onNodesChange` 和 `onEdgesChange` 处理程序：

```tsx
import { useCallback, useState } from 'react';
import { ReactFlow, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Dooring Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

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

  return (
    <div style={{width: '100%', height: '30vh'}}>
      <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
      />
    </div>
    
  );
}

export default Flow;
```

这里发生了什么？每当 `React Flow` 触发更改（节点初始化、节点拖动、边缘选择等）时，就会调用 `onNodesChange` 处理程序。我们导出 `applyNodeChanges` 处理程序，以便您不需要自己处理更改。 

`applyNodeChanges` 处理程序返回更新后的节点数组，即新节点数组。您现在拥有具有以下交互类型的交互流： 

- 可选择的节点和边 
- 可拖动节点 
- 可移除节点和边 
-（按 `Backspace` 删除选定的节点或边，可以使用 `deleteKeyCode` 属性进行调整） 
按 `Shift` 键可以选择多选区域（这是默认的选择键代码） 通过按命令进行多项选择（这是默认的 `multiSelectionKeyCode`） 

为了方便起见，我们导出辅助钩子 `useNodesState` 和 `useEdgesState`，可以使用它们来创建节点和边状态：

```tsx | pure
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
```

### 连接节点

获得完整交互性所缺少的最后一个部分是 `onConnect` 处理程序。我们需要实现它，以便处理新连接。

```tsx
import { useCallback, useState } from 'react';
import { ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Dooring Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

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
      />
    </div>
    
  );
}

export default Flow;
```

在此示例中，我们使用 `addEdge` 处理程序返回一组带有新创建的边的边。如果想在创建边缘时设置某个边缘选项，我们可以像这样传递选项：

```tsx | pure
const onConnect = useCallback(
  (connection) =>
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds)),
  [setEdges],
);
```

或使用 `defaultEdgeOptions` 属性：

```tsx | pure
const defaultEdgeOptions = { animated: true };
...
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  defaultEdgeOptions={defaultEdgeOptions}
/>;
```






