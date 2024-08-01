---
nav: 指南
title: 自定义节点属性
order: 2
group:
  title: 自定义React-Flow
  order: 2
---

## 节点属性


当实现自定义节点时，它被包装在一个组件中，该组件支持选择和拖动等基本功能。自定义节点接收以下属性：

```tsx | pure
export type NodeProps<NodeType extends Node = Node> = {
  id: string;
  data: Node['data'];
  dragHandle?: boolean;
  type?: string;
  selected?: boolean;
  isConnectable?: boolean;
  zIndex?: number;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  dragging: boolean;
  targetPosition?: Position;
  sourcePosition?: Position;
};
```

### 使用

```tsx | pure
import { useState } from 'react';
import { NodeProps, Node } from '@xyflow/react';
 
export type CounterNode = Node<
  {
    initialCount?: number;
  },
  'counter'
>;
 
export default function CounterNode(props: NodeProps<CounterNode>) {
  const [count, setCount] = useState(props.data?.initialCount ?? 0);
 
  return (
    <div>
      <p>计数: {count}</p>
      <button className="nodrag" onClick={() => setCount(count + 1)}>
        添加
      </button>
    </div>
  );
}
```

请记住通过将自定义节点添加到组件的 `nodeTypes` 属性来注册我们的自定义节点。

### 注意事项

如果自定义节点内有不应拖动节点的控件（如滑块）或其他元素，则可以将 `nodrag` 类添加到这些元素。这可以防止单击此类元素时的默认拖动行为以及默认节点选择行为。

```tsx | pure
export default function CustomNode(props: NodeProps) {
  return (
    <div>
      <input className="nodrag" type="range" min={0} max={100} />
    </div>
  );
}
```

如果自定义节点内有滚动容器，则可以添加 `nowheel` 类以在自定义节点内滚动时禁用默认画布平移行为。

```tsx | pure
export default function CustomNode(props: NodeProps) {
  return (
    <div className="nowheel" style={{ overflow: 'auto' }}>
      <p>可滚动的内容......</p>
    </div>
  );
}
```

创建自己的自定义节点时，还需要记住为它们设置样式！与内置节点不同，自定义节点没有默认样式，因此可以使用我们熟悉的任何样式方法，例如 `tailwind`.

