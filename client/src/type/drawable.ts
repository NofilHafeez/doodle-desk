// import type { SerializedShapeData } from "./shapes";

export interface Drawable {
    color?: string;
    strokeWidth?: number;
    fillColor?: string;
    strokeStyle?: number[];
    text?: string;
    points?: { x: number; y: number }[];
    textColor?: string;
    draw(ctx: CanvasRenderingContext2D): void;
    drawSelectionBox(ctx: CanvasRenderingContext2D, camera: { x: number, y: number, scale: number }): void;
    getLeft(): number;
    getRight(): number;
    getTop(): number;
    getBottom(): number;
    getHandles(): {name: string; x: number; y: number; }[];
    move(dx: number, dy: number): void;
    resize(handle: string, mouseX: number, mouseY: number): void;
    editText?(text: string): void;
}

export interface EditableText extends Drawable {
  editText(text: string): void;
}
