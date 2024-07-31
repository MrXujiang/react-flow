---
nav: 指南
  title: 快速开始
  order: -1
group:
  title: 介绍
  order: -1
---

# 快速开始

<div style="text-align: center"><img src="/overview.webp" style="width:60%"></div>

## 基于 Vite 模版快速创建

```bash
npx degit xyflow/vite-react-flow-template app-name
```

如果你已经有完成的React环境, 可以直接安装依赖:

```bash
pnpm add @xyflow/react
```

## 第一个 Flow 案例

`reactflow` 包将 `<ReactFlow />` 组件作为默认导出。 接下来我们看一个简单的案例:

```tsx
import React from 'react';
import { ReactFlow } from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Dooring' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Flow' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function App() {
  return (
    <div style={{ width: '100%', height: '30vh' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView />
    </div>
  );
}
```

有几个值得注意的点:

- 我们必须导入react-flow的样式文件
- `<ReactFlow />` 组件必须被包裹在一个指定宽高的容器里

## 添加节点交互

使用 `React Flow` 创建的图形是完全可交互的。我们可以移动节点，将它们连接在一起，删除它们，……要获得我们需要的基本功能，需要做三件事：

- 在节点发生变化时的回调
- 在边发生变化时的回调
- 在节点被连接时的回调

幸运的是，我们提供了一些钩子来使这变得容易！

```tsx
import React, { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Dooring' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Flow' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
 
export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100%', height: '30vh' }}>
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
```

## 额外的配置

最后，`React Flow` 自带了一些插件，用于实现诸如`迷你地图`或`视口控件`等功能.

```tsx
import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Dooring' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'Flow' } },
  { id: '3', position: { x: 200, y: 100 }, data: { label: 'Nocode/WEP' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' }
  ];
 
export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100%', height: '30vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
```

到此, 我们就创建好了我们第一个可交互的流程图, 接下来我们继续介绍 `react-flow` 的原理和更多高级的技巧.



