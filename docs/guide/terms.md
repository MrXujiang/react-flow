---
nav: 指南
title: 术语&定义
order: 1
group:
  title: 概念&原理
  order: 1
---

## 基本概念

在文档的这一部分，我们会介绍一些基本的 `React Flow` 术语和定义。在 `React Flow` 中我们会经常使用的三个概念是`nodes`, `edges`, 和 `handles`。

### Nodes(节点)

```tsx
import React from 'react';
import { ReactFlow } from '@xyflow/react';
 
const initialNodes = [
  { id: '1', position: { x: 100, y: 50 }, data: { label: 'Dooring节点' } }
];
 
export default function App() {
  return (
    <div style={{ width: '100%', height: '20vh' }}>
      <ReactFlow nodes={initialNodes} fitView />
    </div>
  );
}
```

`React Flow` 中的节点是一个 `React` 组件。这意味着它可以渲染我们喜欢的任何内容。每个节点都有一个 `x` 和 `y` 坐标，这指明了节点在视口中的位置。默认情况下，节点如上例所示。我们可以在节点选项文档中找到用于自定义节点的所有选项。

#### 自定义节点

这就是 `React Flow` 的神奇之处。我们可以自定义节点的外观和行为。我们可以创建的许多功能并非内置于 `React Flow` 中。

使用自定义节点执行以下操作： 

- 渲染表单元素 
- 可视化数据 
- 支持多个手柄

如下案例:

```tsx | pure
import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
 
const handleStyle = { left: 10 };
 
function TextUpdaterNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
 
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}
```

### Handles(句柄)

```tsx
import React from 'react';
import { ReactFlow, Handle, Position } from '@xyflow/react';

const style = {
  border: '1px solid #eee',
  padding: '5px 10px',
  borderRadius: '5px',
  background: 'white',
  background: '#06c',
  color: 'white',
}

const CustomNode = ({ data }) => {
  return (
    <>
      <div style={style}>
        {data.label}
      </div>
 
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};

const nodeTypes = { textUpdater: CustomNode };
 
const initialNodes = [
  { 
    id: '1', 
    position: { x: 100, y: 50 }, 
    data: { label: 'Dooring节点' },
    type: 'textUpdater',
  }
];
 
export default function App() {
  return (
    <div style={{ width: '100%', height: '20vh' }}>
      <ReactFlow nodes={initialNodes} nodeTypes={nodeTypes} fitView />
    </div>
  );
}
```

句柄（在其他库中也称为“端口”）是边连接到节点的地方。手柄可放置在任何地方，并可根据我们的喜好设计风格。它只是一个 `div` 元素。默认情况下，它在节点的顶部、底部、左侧或右侧显示为灰色圆圈。创建自定义节点时，我们可以在节点中拥有所需数量的句柄。

案例代码如下:

```tsx | pure
import React from 'react';
import { ReactFlow, Handle, Position } from '@xyflow/react';

const style = {
  border: '1px solid #eee',
  padding: '5px 10px',
  borderRadius: '5px',
  background: 'white',
  background: '#06c',
  color: 'white',
}

const CustomNode = ({ data }) => {
  return (
    <>
      <div style={style}>
        {data.label}
      </div>
 
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};

const nodeTypes = { textUpdater: CustomNode };
 
const initialNodes = [
  { 
    id: '1', 
    position: { x: 100, y: 50 }, 
    data: { label: 'Dooring节点' },
    type: 'textUpdater',
  }
];
 
export default function App() {
  return (
    <div style={{ width: '100%', height: '20vh' }}>
      <ReactFlow nodes={initialNodes} nodeTypes={nodeTypes} fitView />
    </div>
  );
}
```


### Edges(边)

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
  Handle, 
  Position
} from '@xyflow/react';

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY }) => {
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
        <span style={{position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`}}>  
          自定义
        </span>  
      </EdgeLabelRenderer>
    </>
  );
}

const style = {
  border: '1px solid #eee',
  padding: '5px 10px',
  borderRadius: '5px',
  background: 'white',
  background: '#06c',
  color: 'white',
}

const CustomNode = ({ data }) => {
  return (
    <>
      <div style={style}>
        {data.label}
      </div>
 
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};


const initialNodes = [
  { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Dooring系列产品' }, type: 'textUpdater' },
  { id: 'b', position: { x: 300, y: 0 }, data: { label: 'H5-Dooring' }, type: 'textUpdater' },
];

const initialEdges = [
  { id: 'a->b', type: 'custom-edge', source: 'a', target: 'b' },
];

const edgeTypes = {
  'custom-edge': CustomEdge,
};

const nodeTypes = { textUpdater: CustomNode };

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
    <div style={{ width: '100%', height: '20vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}

export default Flow;
```

一条边连接两个节点。每条边都需要一个目标节点和一个源节点。 `React Flow` 具有四种内置边缘类型：

- 默认（贝塞尔曲线）
- smoothstep
- step 
- Straight

边缘是 `SVG` 路径，可以使用 `CSS` 进行样式设置，并且是完全可定制的。如果我们使用多个句柄，则可以单独引用它们来为一个节点创建多个连接。


### Connection Line(连接线)

`React Flow` 的内置功能，可以通过单击并从一个手柄拖动到另一个手柄来创建新边缘。拖动时，占位符边缘称为连接线。连接线还内置四种类型，并且可以定制。我们可以在 `props` 部分找到用于配置连接线的 `props`。

### 视口

```tsx
import React, { useCallback, useState } from 'react';
import { ReactFlow } from '@xyflow/react';
 
export default function App() {
  const [initialNodes, setState] = useState({ id: '1', width: 160,
 position: { x: 100, y: 50 }, data: { label: 'Dooring节点, 拖拽试试?' } });

  const handleNodesChange = useCallback((nodes) => {
    if(nodes[0].type === 'position') {
      if(!nodes[0].position.x) return

      const x = Math.floor(nodes[0].position.x);
      const y = Math.floor(nodes[0].position.y);
      setState({...initialNodes, data: { label: `x: ${x}, y: ${y}`}, position: nodes[0].position});
    }
    
  }, []);

  return (
    <div style={{ width: '100%', height: '30vh' }}>
      <ReactFlow nodes={[initialNodes]} onNodesChange={handleNodesChange} fitView />
    </div>
  );
}
```

所有 `React Flow` 都存在于视口内部。视口具有 `x、y` 和缩放值。当我们拖动窗格时，会更改 `x` 和 `y` 坐标，当我们放大或缩小时，会更改缩放级别。

