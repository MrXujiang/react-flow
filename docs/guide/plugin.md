---
nav: 指南
title: 插件介绍
order: 4
group:
  title: 概念&原理
  order: 1
---

## 插件系统

`React Flow` 附带了几个额外的插件组件。在本指南中，我们向您展示如何使用它们。我们在这里使用之前的示例代码。

### MiniMap(缩略图)

如果我们的流程图很大，可能希望快速获得概览。为此，我们构建了 `MiniMap` 组件。可以通过将其添加为子项来轻松将其添加到您的流程中：

```tsx
import { ReactFlow, MiniMap } from '@xyflow/react';

const defaultNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Dooring用户' },
    position: { x: 250, y: 25 },
    style: { backgroundColor: '#6ede87', color: 'white' },
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Dooring零代码平台</div> },
    position: { x: 100, y: 125 },
    style: { backgroundColor: '#ff0072', color: 'white' },
  },
  {
    id: '3',
    type: 'output',
    data: { label: '发布页面' },
    position: { x: 250, y: 250 },
    style: { backgroundColor: '#6865A5', color: 'white' },
  },
];
const defaultEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'output':
      return '#6865A5';
    default:
      return '#ff0072';
  }
};

function Flow() {
  return (
    <div style={{ width: '100%', height: '60vh' }}>
    <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView>
      <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
    </div>
    
  );
}

export default Flow;
```

### 画布控件

`React Flow` 带有一个可自定义的控件栏，我们可以通过导入 `Controls` 组件来使用它:

```tsx
import { ReactFlow, Controls } from '@xyflow/react';

const defaultNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Dooring用户' },
    position: { x: 250, y: 25 },
    style: { backgroundColor: '#6ede87', color: 'white' },
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Dooring零代码平台</div> },
    position: { x: 100, y: 125 },
    style: { backgroundColor: '#ff0072', color: 'white' },
  },
  {
    id: '3',
    type: 'output',
    data: { label: '发布页面' },
    position: { x: 250, y: 250 },
    style: { backgroundColor: '#6865A5', color: 'white' },
  },
];
const defaultEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

function Flow() {
  return (
    <div style={{ width: '100%', height: '40vh' }}>
    <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView>
      <Controls />
    </ReactFlow>
    </div>
    
  );
}

export default Flow;
```

### 背景

如果想显示图案背景，可以使用 `Background` 组件:

```tsx
import { useState } from 'react';
import { ReactFlow, Background, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const defaultNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Dooring用户' },
    position: { x: 250, y: 25 },
    style: { backgroundColor: '#6ede87', color: 'white' },
  },

  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Dooring零代码平台</div> },
    position: { x: 100, y: 125 },
    style: { backgroundColor: '#ff0072', color: 'white' },
  },
  {
    id: '3',
    type: 'output',
    data: { label: '发布页面' },
    position: { x: 250, y: 250 },
    style: { backgroundColor: '#6865A5', color: 'white' },
  },
];

const defaultEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

function Flow() {
  const [variant, setVariant] = useState('cross');

  return (
    <div style={{ width: '100%', height: '40vh' }}>
      <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView>
        <Background color="#ccc" variant={variant} />
        <Panel>
          <div>修改背景:</div>
          <button onClick={() => setVariant('dots')}>点</button>
          <button onClick={() => setVariant('lines')}>网格线</button>
          <button onClick={() => setVariant('cross')}>十字线</button>
        </Panel>
      </ReactFlow>
    </div>
    
  );
}

export default Flow;
```










