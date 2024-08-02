---
nav: 指南
title: 布局框架
order: 1
group:
  title: 布局
  order: 3
---

## 布局

我们经常被问到如何处理 `React Flow` 中的布局。虽然我们可以在 `React Flow` 中构建一些基本的布局，但我们相信您最了解您的应用程序的需求，并且有如此多的选项，我们认为您最好选择最适合您工作的工具（更不用说它是一个整体）为我们做了大量的工作）。

如果不知道这些选项是什么，不用担心，本指南可以为您提供帮助！我们将把资源分成用于布局节点的资源和用于路由边缘的资源。

首先，让我们整理一个简单的示例流程，我们可以将其用作测试不同布局选项的基础。

<code src="./demo/layout.tsx"></code>

下面的每个示例都将构建在这个空流程上。我们尽可能将示例限制在一个 `index.js` 文件中，以便可以轻松比较它们的设置方式。

### 布局节点

对于布局节点，有一些我们认为值得检查的第三方库：

![](/library.png)

`Dagre` 目前有一个未解决的问题，如果子流中的任何节点连接到子流外部的节点，则该问题将阻止其正确布局子流。

我们对这些选项从最简单到最复杂进行了松散的排序，其中 `dagre` 很大程度上是一个嵌入式解决方案，而 `elkjs` 是一个成熟的高度可配置的布局引擎。

下面，我们将看一个简短的示例，了解如何将每个库与 `React Flow` 一起使用。特别是对于 `dagre` 和 `elkjs`，我们有一些单独的示例，您可以参考此处和此处。

#### Dagre

`Dagre` 是一个用于布局有向图的简单库。它具有最少的配置选项，并且注重速度而不是选择最佳布局。如果您需要将流程组织成树，我们强烈推荐 `dagre`。

```tsx | pure
import Dagre from '@dagrejs/dagre';
import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';

import { initialNodes, initialEdges } from './nodes-edges.js';
import '@xyflow/react/dist/style.css';

const getLayoutedElements = (nodes, edges, options) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction) => {
      console.log(nodes);
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </Panel>
    </ReactFlow>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
```

不费吹灰之力，我们就得到了组织良好的树形布局！每当调用 `getLayoutedElements` 时，我们都会重置 `dagre` 图并根据 `Direction` 属性设置图的方向（从左到右或从上到下）。 `Dagre` 需要知道每个节点的尺寸才能对它们进行布局，因此我们迭代节点列表并将它们添加到 `Dagre` 的内部图中。

布局图形后，我们将返回一个带有布局节点和边的对象。我们通过映射原始节点列表并根据 `dagre` 图中存储的节点更新每个节点的位置来做到这一点。

#### D3-Hierarchy

当您知道您的图形是具有单个根节点的树时，`d3-hierarchy` 可以提供一些有趣的布局选项。虽然该库可以很好地布局简单的树，但它还具有用于树图、分区布局和外壳图的布局算法。

<img src="/d3.png" width=320 />

```tsx | pure
import { stratify, tree } from 'd3-hierarchy';
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';

import { initialNodes, initialEdges } from './nodes-edges.js';
import '@xyflow/react/dist/style.css';

const g = tree();

const getLayoutedElements = (nodes, edges, options) => {
  if (nodes.length === 0) return { nodes, edges };

  const { width, height } = document
    .querySelector(`[data-id="${nodes[0].id}"]`)
    .getBoundingClientRect();
  const hierarchy = stratify()
    .id((node) => node.id)
    .parentId((node) => edges.find((edge) => edge.target === node.id)?.source);
  const root = hierarchy(nodes);
  const layout = g.nodeSize([width * 2, height * 2])(root);

  return {
    nodes: layout
      .descendants()
      .map((node) => ({ ...node.data, position: { x: node.x, y: node.y } })),
    edges,
  };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, {
          direction,
        });

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
        <button onClick={onLayout}>layout</button>
      </Panel>
    </ReactFlow>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
```

:::warning
D3 层次结构期望您的图形具有单个根节点，因此它并非在所有情况下都有效。同样重要的是要注意，`d3-hierarchy` 在计算布局时为所有节点分配相同的宽度和高度，因此如果您要显示许多不同的节点类型，它不是最佳选择。
:::

#### D3-Force

强制一些比树更有趣的东西，强制导向的布局可能是正确的选择。 `D3-Force` 是一个基于物理的布局库，可以通过向节点施加不同的力来使用位置节点。

因此，与 `dagre` 和 `d3-hierarchy` 相比，它的配置和使用稍微复杂一些。重要的是，`d3-force` 的布局算法是迭代的，因此我们需要一种方法来跨多个渲染持续计算布局。

<img src="/force.png" width=320 />

```tsx | pure
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
} from 'd3-force';
import React, { useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useNodesInitialized,
} from '@xyflow/react';

import { initialNodes, initialEdges } from './nodes-edges.js';
import { collide } from './collide.js';

import '@xyflow/react/dist/style.css';

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-1000))
  .force('x', forceX().x(0).strength(0.05))
  .force('y', forceY().y(0).strength(0.05))
  .force('collide', collide())
  .alphaTarget(0.05)
  .stop();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const initialized = useNodesInitialized();

  return useMemo(() => {
    let nodes = getNodes().map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }));
    let edges = getEdges().map((edge) => edge);
    let running = false;

    // If React Flow hasn't initialized our nodes with a width and height yet, or
    // if there are no nodes in the flow, then we can't run the simulation!
    if (!initialized || nodes.length === 0) return [false, {}];

    simulation.nodes(nodes).force(
      'link',
      forceLink(edges)
        .id((d) => d.id)
        .strength(0.05)
        .distance(100),
    );

    // The tick function is called every animation frame while the simulation is
    // running and progresses the simulation one step forward each time.
    const tick = () => {
      getNodes().forEach((node, i) => {
        const dragging = Boolean(
          document.querySelector(`[data-id="${node.id}"].dragging`),
        );

        // Setting the fx/fy properties of a node tells the simulation to "fix"
        // the node at that position and ignore any forces that would normally
        // cause it to move.
        nodes[i].fx = dragging ? node.position.x : null;
        nodes[i].fy = dragging ? node.position.y : null;
      });

      simulation.tick();
      setNodes(
        nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })),
      );

      window.requestAnimationFrame(() => {
        // Give React and React Flow a chance to update and render the new node
        // positions before we fit the viewport to the new layout.
        fitView();

        // If the simulation hasn't be stopped, schedule another tick.
        if (running) tick();
      });
    };

    const toggle = () => {
      running = !running;
      running && window.requestAnimationFrame(tick);
    };

    const isRunning = () => running;

    return [true, { toggle, isRunning }];
  }, [initialized]);
};

const LayoutFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [initialized, { toggle, isRunning }] = useLayoutedElements();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Panel>
        {initialized && (
          <button onClick={toggle}>
            {isRunning() ? 'Stop' : 'Start'} force simulation
          </button>
        )}
      </Panel>
    </ReactFlow>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
```

我们已将 `getLayoutedElements` 更改为名为 `useLayoutedElements` 的挂钩。此外，我们将使用 `useReactFlow` 挂钩中的 `get getNodes` 和 `getEdges` 函数，而不是显式传递节点和边。当与初始化的存储选择器结合使用时，这一点很重要，因为它将阻止我们在节点更新时重新配置模拟。

#### Elkjs

`Elkjs` 无疑是最可配置的选择，但它也是最复杂的。 `Elkjs` 是一个已移植到 `JavaScript` 的 `Java` 库，它提供了大量用于配置图形布局的选项。

<img src="/elk.png" width=320 />

```tsx | pure
import ELK from 'elkjs/lib/elk.bundled.js';
import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';

import { initialNodes, initialEdges } from './nodes-edges.js';
import '@xyflow/react/dist/style.css';

const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getLayoutedElements = useCallback((options) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes(),
      edges: getEdges(),
    };

    elk.layout(graph).then(({ children }) => {
      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children.forEach((node) => {
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children);
      window.requestAnimationFrame(() => {
        fitView();
      });
    });
  }, []);

  return { getLayoutedElements };
};

const LayoutFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { getLayoutedElements } = useLayoutedElements();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'layered',
              'elk.direction': 'DOWN',
            })
          }
        >
          vertical layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'layered',
              'elk.direction': 'RIGHT',
            })
          }
        >
          horizontal layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'org.eclipse.elk.radial',
            })
          }
        >
          radial layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({
              'elk.algorithm': 'org.eclipse.elk.force',
            })
          }
        >
          force layout
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
```





