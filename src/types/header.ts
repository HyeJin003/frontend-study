import type { ReactNode } from "react";

export interface HeaderType {
  title: string;
  leftChild?: ReactNode;
  rightChild?: ReactNode;
}
