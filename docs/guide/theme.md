---
nav: 指南
title: 自定义主题
order: 5
group:
  title: 自定义React-Flow
  order: 2
---

## 主题

`React Flow` 在构建时就考虑到了深度定制。我们的许多用户完全改变了 `React Flow` 的外观，以匹配他们自己的品牌或设计系统。本指南将向大家介绍自定义 `React Flow` 外观的不同方法。

### 默认样式

`React Flow` 的默认样式足以使用内置节点。它们为填充、边框半径和动画边缘等样式提供了一些合理的默认值。可以在下面看到它们的样子：

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
    <div style={{ width: '100%', height: '50vh' }}>
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

通常会通过将这些默认样式导入 `App.jsx` 文件或其他入口点来加载它们.

```tsx | pure
import '@xyflow/react/dist/style.css';
```

无需深入研究自定义节点和边，我们可以通过三种方式来设计 `React Flow` 的基本外观：

- 通过 `style props` 传递内联样式 
- 使用自定义 `CSS` 覆盖内置类 
- 覆盖 `React Flow` 使用的 `CSS` 变量

### 内置深色和浅色模式

我们可以使用 `colorMode` 属性（'dark'、'light' 或 'system'）选择一种内置颜色模式，如下示例中所示。

```tsx | pure
import ReactFlow from '@xyflow/react';
 
export default function Flow() {
  return <ReactFlow colorMode="dark" nodes={[...]} edges={[...]} />
}
```

当使用 `colorMode` 属性时，`React Flow` 会向根元素 (`.react-flow`) 添加一个类，可以使用该类根据颜色模式设置流的样式：

```css | pure
.dark .react-flow__node {
  background: #777;
  color: white;
}
 
.light .react-flow__node {
  background: white;
  color: #111;
}
```

### 自定义样式

开始自定义流程外观的最简单方法是使用 `React Flow` 组件上的 `style` 属性来内联您自己的 `CSS`。

```tsx | pure
import ReactFlow from '@xyflow/react';
const styles = {
  background: 'red',
  width: '100%',
  height: 300,
};
 
export default function Flow() {
  return <ReactFlow style={styles} nodes={[...]} edges={[...]} />
}
```

### CSS变量

如果我们不想完全替换默认样式，而只是想调整整体外观和感觉，则可以覆盖我们在整个库中使用的一些 `CSS` 变量。

这些变量大多是不言自明的。下表列出了可能想要调整的所有变量及其默认值以供参考：

| 变量 | 默认值 |
| ---- | ---- |
| --edge-stroke-default | #b1b1b7 |
| --edge-stroke-width-default | 1 |
| --edge-stroke-selected-default | #555 |
| --connectionline-stroke-default | #b1b1b7 |
| --connectionline-stroke-width-default | 1 |
| --attribution-background-color-default | rgba(255, 255, 255, 0.5) |
| --minimap-background-color-default | #fff |
| --background-pattern-dot-color-default | #91919a |
| --background-pattern-line-color-default | #eee |
| --background-pattern-cross-color-default | #e2e2e2 |
| --node-color-default | inherit |
| --node-border-default | 1px solid #1a192b |
| --node-background-color-default | #fff |
| --node-group-background-color-default | rgba(240, 240, 240, 0.25) |
| --node-boxshadow-hover-default | 0 1px 4px 1px rgba(0, 0, 0, 0.08) |
| --node-boxshadow-selected-default | 0 0 0 0.5px #1a192b |
| --handle-background-color-default | #1a192b |
| --handle-border-color-default | #fff |
| --selection-background-color-default | rgba(0, 89, 220, 0.08) |
| --selection-border-default | 1px dotted rgba(0, 89, 220, 0.8) |
| --controls-button-background-color-default | #fefefe |
| --controls-button-background-color-hover-default | #f4f4f4 |
| --controls-button-color-default | inherit |
| --controls-button-color-hover-default | inherit |
| --controls-button-border-color-default | #eee |
| --controls-box-shadow-default | 0 0 2px 1px rgba(0, 0, 0, 0.08) |

这些变量用于定义 `React Flow` 的各个元素的默认值。这意味着它们仍然可以在每个元素的基础上被内联样式或自定义类覆盖。

### 重写内置类

有些人认为大量使用内联样式是一种反模式。在这种情况下，可以使用自己的 `CSS` 覆盖 `React Flow` 使用的内置类。 `React Flow` 中的各种元素都附加了许多类，但下面列出了您可能想要覆盖的类：

| 类名 | 描述 |
| ---- | ---- |
|.react-flow | The outermost container |
|.react-flow__renderer | The inner container |
|.react-flow__zoompane | Zoom & pan pane |
|.react-flow__selectionpane | Selection pane |
|.react-flow__selection | User selection |
|.react-flow__edges | The element containing all edges in the flow |
|.react-flow__edge | Applied to each Edge in the flow |
|.react-flow__edge.selected | Added to an Edge when selected |
|.react-flow__edge.animated | Added to an Edge when its animated prop is true |
|.react-flow__edge.updating | Added to an Edge while it gets updated via onReconnect |
|.react-flow__edge-path | The SVG `<path />` element of an Edge |
|.react-flow__edge-text | The SVG `<text />` element of an Edge label |
|.react-flow__edge-textbg | The SVG `<text />` element behind an Edge label |
|.react-flow__connection | Applied to the current connection line |
|.react-flow__connection-path | The SVG `<path />` of a connection line |
|.react-flow__nodes | The element containing all nodes in the flow |
|.react-flow__node | Applied to each Node in the flow |
|.react-flow__node.selected | Added to a Node when selected. |
|.react-flow__node-default | Added when Node type is "default" |
|.react-flow__node-input | Added when Node type is "input" |
|.react-flow__node-output | Added when Node type is "output" |
|.react-flow__nodesselection | Nodes selection |
|.react-flow__nodesselection-rect | Nodes selection rect |
|.react-flow__handle | Applied to each `<Handle />` component |
|.react-flow__handle-top | Applied when a handle's Position is set to "top" |
|.react-flow__handle-right | Applied when a handle's Position is set to "right" |
|.react-flow__handle-bottom | Applied when a handle's Position is set to "bottom" |
|.react-flow__handle-left | Applied when a handle's Position is set to "left" |
|.react-flow__handle-connecting | Applied when a connection line is above a handle. |
|.react-flow__handle-valid | Applied when a connection line is above a handle and the connection is valid |
|.react-flow__background | Applied to the `<Background />` component |
|.react-flow__minimap | Applied to the `<MiniMap />` component |
|.react-flow__controls | Applied to the `<Controls />` component |

:::warning
需要注意的是有些类名是 `react-flow` 框架功能必备的, 如果覆盖可能导致功能上的bug.
:::

### 第三方解决方案

您可以选择完全退出 `React Flow` 的默认样式并使用第三方样式解决方案。如果您想执行此操作，则必须确保仍导入基本样式。

```tsx| pure
import '@xyflow/react/dist/base.css';
```

#### Styled Components 模式
许多直接渲染的组件（例如`<MiniMap />`）都接受 `className` 和 `style` 属性。这意味着可以使用我们喜欢的任何样式解决方案，例如`Styled Components`:

```tsx | pure
import { MiniMap } from '@xyflow/react';
 
const StyledMiniMap = styled(MiniMap)`
  background-color: ${(props) => props.theme.bg};
 
  .react-flow__minimap-mask {
    fill: ${(props) => props.theme.minimapMaskBg};
  }
 
  .react-flow__minimap-node {
    fill: ${(props) => props.theme.nodeBg};
    stroke: none;
  }
`;
```

#### TailwindCSS 模式

自定义节点和边是 `React` 组件，可以使用任何我们想要的样式解决方案来设置它们的样式。例如，可能想要使用 `Tailwind` 来设置节点的样式：

```tsx | pure
function CustomNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          {data.emoji}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.name}</div>
          <div className="text-gray-500">{data.job}</div>
        </div>
      </div>
 
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}
```

:::warning
如果我们想覆盖默认样式，请确保在 `React Flows` 基本样式之后导入 `Tailwinds` 入口点。
:::

```tsx | pure
import '@xyflow/react/dist/style.css';
import 'tailwind.css';
```










