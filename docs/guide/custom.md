---
nav: 指南
title: 自定义节点
order: 1
group:
  title: 自定义React-Flow
  order: 2
---

## 自定义节点

`React Flow` 的一个强大功能是添加自定义节点的能力。在我们的自定义节点中，可以渲染我们想要的一切。例如，可以定义多个源和目标句柄并呈现表单输入或图表。在本节中，我们将实现一个带有输入字段的节点，该输入字段更新应用程序另一部分中的一些文本。

### 实现自定义节点

自定义节点是一个 `React` 组件，它被包装以提供选择或拖动等基本功能。除了其他属性之外，我们还从包装器组件传递`位置`或`数据`等属性。让我们开始实现 `TextUpdaterNode`。我们使用 `Handle` 组件能够将自定义节点与其他节点连接并向该节点添加输入字段：

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

如您所见，我们已将类名 `nodrag` 添加到输入框中。可以防止在输入字段内拖动并让我们选择文本。

### 添加节点类型

我们可以通过将新的节点类型添加到 `nodeTypes` 属性来将其添加到 `React Flow`。节点类型在组件外部被记忆或定义是很重要的。否则，`React` 在每次渲染时都会创建一个新对象，这会导致性能问题和错误。

```tsx | pure
const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
 
return <ReactFlow nodeTypes={nodeTypes} />;
```

定义新的节点类型后，我们可以使用 `type` 节点选项来使用它：

```tsx | pure
const nodes = [
  {
    id: 'node-1',
    type: 'textUpdater',
    position: { x: 0, y: 0 },
    data: { value: 123 },
  },
];
```

将所有内容放在一起并添加一些基本样式后，我们得到一个将文本打印到控制台的自定义节点:

<code src="./demo/custom.tsx"></code>

### 使用多句柄

正如所看到的，我们向节点添加了两个源句柄，以便它有两个输出。如果你想用这些特定的句柄连接其他节点，节点 `id` 是不够的，你还需要传递特定的句柄`id`。在本例中，一个句柄的 `ID` 为`“a”`，另一个句柄的 `ID` 为`“b”`。句柄特定边使用引用节点内句柄的 `sourceHandle` 或 `targetHandle` 选项：

```tsx | pure
const initialEdges = [
  { id: 'edge-1', source: 'node-1', sourceHandle: 'a', target: 'node-2' },
  { id: 'edge-2', source: 'node-1', sourceHandle: 'b', target: 'node-3' },
];
```

在这种情况下，两个句柄的源节点都是 `node-1`，但句柄 `ID` 不同。一个来自句柄 `ID“a”`，另一个来自 `“b”`。两条边也有不同的目标节点：

<code src="./demo/multihandle.tsx"></code>

请注意，如果我们以编程方式更改自定义节点中句柄的位置或数量，则需要使用 `useUpdateNodeInternals` 挂钩来正确通知 `ReactFlow` 更改。从这章我们应该能够构建自定义节点。在大多数情况下，我们建议仅使用自定义节点。内置的只是基本示例。可以在自定义节点 `API` 部分找到传递的 `props` 列表和更多信息。




