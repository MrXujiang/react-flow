---
nav: 指南
title: 自定义边属性
order: 4
group:
  title: 自定义React-Flow
  order: 2
---

## 边的属性

当我们实现自定义边时，它被包装在启用一些基本功能的组件中。自定义边组件接收以下属性：

```tsx | pure
export type EdgeProps<EdgeType extends Edge = Edge> = {
  id: string;
  animated: boolean;
  data: EdgeType['data'];
  style: React.CSSProperties;
  selected: boolean;
  source: string;
  target: string;
  sourceHandleId?: string | null;
  targetHandleId?: string | null;
  interactionWidth: number;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  label?: string | React.ReactNode;
  labelStyle?: React.CSSProperties;
  labelShowBg?: boolean;
  labelBgStyle?: CSSProperties;
  labelBgPadding?: [number, number];
  labelBgBorderRadius?: number;
  markerStart?: string;
  markerEnd?: string;
  pathOptions?: any;
};
```



