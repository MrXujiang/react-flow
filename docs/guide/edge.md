---
nav: 指南
title: 自定义边
order: 3
group:
  title: 自定义React-Flow
  order: 2
---

## 自定义边

与自定义节点一样，`React Flow` 中的自定义边的一部分只是 `React` 组件：这意味着可以沿着边渲染任何想要的东西！本指南将展示如何使用一些附加控件来实现自定义边缘。

### 一个简单的自定义边案例

如果边不能渲染两个连接节点之间的路径，那么它对我们来说就没多大用处。这些路径始终基于 `SVG`，并且通常使用
组件进行渲染。为了计算要渲染的实际 `SVG` 路径，`React Flow` 附带了一些方便的实用函数：

- getBezierPath
- getSimpleBezierPath
- getSmoothStepPath
- getStraightPath

为了启动我们的自定义边缘，我们只需在源和目标之间渲染一条直线路径。

```tsx | pure
import { BaseEdge, getStraightPath } from '@xyflow/react';
 
export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
}
```

:::info{title=提示}
传递给自定义边缘组件的所有 props 都可以在 EdgeProps 类型下的 API 参考中找到。
:::

这为我们提供了一条直边，其行为与默认的 “`straight`(直)” 边类型相同。要使用它，我们还需要更新
组件上的 `edgeTypes` 属性。

在组件外部定义 `EdgeTypes` 对象或使用 `React` 的 `useMemo` 钩子来防止不必要的重新渲染非常重要。如果忘记执行此操作，`React Flow` 将在控制台中显示警告。

```tsx | pure
import ReactFlow from '@xyflow/react'
import CustomEdge from './CustomEdge'
 
 
const edgeTypes = {
  'custom-edge': CustomEdge
}
 
export function Flow() {
  return <ReactFlow edgeTypes={edgeTypes} ... />
}
```

定义 `edgeTypes` 对象后，我们可以通过将边的类型字段设置为 “`custom-edge`” 来使用新的自定义边。

```tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  BaseEdge, getStraightPath
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
}

const initialNodes = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
  { id: 'b', position: { x: 0, y: 100 }, data: { label: 'Node B' } },
];

const initialEdges = [
  { id: 'a->b', type: 'custom-edge', source: 'a', target: 'b' },
];

const edgeTypes = {
  'custom-edge': CustomEdge,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: 'custom-edge' };
      setEdges((eds) => addEdge(edge, eds));
    },
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
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
}

export default Flow;
```

### 添加边标签

自定义边最常见的用途之一是沿着边缘的路径呈现一些控件或信息。在 `React Flow` 中，我们称之为边标签，与边路径不同，边标签可以是任何 `React` 组件！

要渲染自定义边标签，我们必须将其包装在 `<EdgeLabelRenderer />` 组件中。出于性能原因，这是必要的：边标签渲染器是所有边标签都渲染到其中的单个容器的部分。

让我们向自定义边添加一个按钮，可用于删除其附加的边：

```tsx | pure
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';
 
export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { setEdges } = useReactFlow();
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
 
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button
          onClick={() => setEdges((edges) => edges.filter((e) => e.id !== id))}
        >
          删除
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
```

如果我们现在尝试使用此边，我们将看到该按钮呈现在流程的中心（它可能隐藏在“节点 A”后面）。由于边标签的存在，我们需要做一些额外的工作来自己定位按钮。

![](/edge.webp)

幸运的是，我们的路径`API`可以帮助我们做到这一点！除了要渲染的 `SVG` 路径之外，这些函数还返回路径中点的 `x` 和 `y` 坐标。然后，我们可以使用这些坐标将自定义边缘标签转换到正确的位置！

```tsx | pure
export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({ ... });
 
  return (
    ...
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
    ...
  );
}
```

:::info{title=提示}
为了确保我们的边标签是交互式的，而不仅仅是用于展示，添加指针事件非常重要：`all` 到标签的样式。这将确保标签是可点击的。 就像自定义节点中的交互式控件一样，我们需要记住将 `nodrag` 和 `nopan` 类添加到标签中，以阻止鼠标事件控制画布。
:::

这是一个带有我们更新的自定义边的交互式示例。单击删除按钮将从流中删除该边。创建新边将使用自定义节点。

```tsx
import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';

function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
          删除
        </button>
      </EdgeLabelRenderer>
    </>
  );
}


const initialNodes = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } },
  { id: 'b', position: { x: 0, y: 100 }, data: { label: 'Node B' } },
  { id: 'c', position: { x: 0, y: 200 }, data: { label: 'Node C' } },
];

const initialEdges = [
  { id: 'a->b', type: 'custom-edge', source: 'a', target: 'b' },
  { id: 'b->c', type: 'custom-edge', source: 'b', target: 'c' },
];

const edgeTypes = {
  'custom-edge': CustomEdge,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: 'custom-edge' };
      setEdges((eds) => addEdge(edge, eds));
    },
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
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
}

export default Flow;
```


