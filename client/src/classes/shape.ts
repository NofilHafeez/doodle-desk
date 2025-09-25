export abstract class Shape {
  static HANDLE_SIZE = 10; // <-- single source of truth
  name: string;
  strokeWidth: number;
  color: string;
  fillColor: string;
  strokeStyle: number[];

  constructor(
    color: string = "black",
    name: string,
    strokeWidth: number = 1,
    fillColor: string = "transparent",
    strokeStyle: number[] = [0, 0]
  ) {
    this.color = color;
    this.name = name;
    this.strokeWidth = strokeWidth;
    this.fillColor = fillColor;
    this.strokeStyle = strokeStyle;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract getLeft(): number;
  abstract getRight(): number;
  abstract getTop(): number;
  abstract getBottom(): number;
  abstract drawSelectionBox(ctx: CanvasRenderingContext2D, camera: { x: number, y: number, scale: number }): void;
  abstract getHandles(): {name: string; x: number; y: number; }[];
  

  
}
