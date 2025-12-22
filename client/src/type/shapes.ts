import type { Drawable } from "./drawable";

export type ShapeType = 
  | "circle" 
  | "rectangle" 
  | "diamond" 
  | "line" 
  | "text" 
  | "draw"; // ✅ include draw

export interface ShapeInterface {
  id: number;
  type: ShapeType;
  shape: Drawable; // always store a class instance in memory
}

export interface CircleData {
  id: number;
  type: "circle";
  shape: {
    center: { x: number; y: number };
    radiusx: number;
    radiusy: number;
    color: string;
    name: string;
    strokeWidth: number;
    fillColor: string;
    strokeStyle: number[];
  };
}

export interface RectangleData {
  id: number;
  type: "rectangle";
  shape: {
    topLeft: { x: number; y: number };
    width: number;
    height: number;
    color: string;
    name: string;
    strokeWidth: number;
    fillColor: string;
    strokeStyle: number[];
  };
}

export interface DiamondData {
  id: number;
  type: "diamond";
  shape: {
    center: { x: number; y: number };
    radiusx: number;
    radiusy: number;
    color: string;
    name: string;
    strokeWidth: number;
    fillColor: string;
    strokeStyle: number[];
  };
}

export interface LineData {
  id: number;
  type: "line";
  shape: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    color: string;
    name: string;
    strokeWidth: number;
    fillColor: string;
    strokeStyle: number[];
  };
}

export interface TextData {
  id: number;
  type: "text";
  shape: {
    text: string;
    topLeft: { x: number; y: number };
    width: number;
    height: number;
    textColor: string;
  };
} 

// New DrawData for freehand brush
export interface DrawData {
  id: number;
  type: "draw";
  shape: {
    points: { x: number; y: number }[]; // all brush stroke points
    color: string;
    strokeWidth: number;
  };
}

export type SerializedShapeData =
  | CircleData
  | RectangleData
  | DiamondData
  | LineData
  | TextData
  | DrawData; // ✅ add draw here
