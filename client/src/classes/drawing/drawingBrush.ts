import type { Drawable } from "../../type/drawable";
import { Shape } from "../shape";

export class drawingBrush implements Drawable {
  points: { x: number; y: number }[];
  color?: string;
  strokeWidth?: number; 

  // to get draw from the local Storage
  constructor(startX: number, startY: number, color: string, strokeWidth: number) 

  // to deserialize when draw gets from other user
  constructor(points: { x: number; y: number }[], color: string, strokeWidth: number);

  // to  create the draw brush in canvas
  constructor( 
    arg1: number | { x: number; y: number }[],
    arg2: number | string,
    arg3?: string | number,
    arg4?: number
  ) {
    if (typeof arg1 === "number" && typeof arg2 === "number") {
      // case: normal drawing start
      this.points = [{ x: arg1, y: arg2 }];
      this.color = arg3 as string;
      this.strokeWidth = arg4 as number;
    } else {
      // case: deserialization
      this.points = arg1 as { x: number; y: number }[];
      this.color = arg2 as string;
      this.strokeWidth = arg3 as number;
    }
  }

  addPoint(x: number, y: number) {
    this.points.push({ x, y });
  }

  // main drawing
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.points.length < 2) return;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.color || "black";
    ctx.lineWidth = this.strokeWidth || 1;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length - 1; i++) {
      const midX = (this.points[i].x + this.points[i + 1].x) / 2;
      const midY = (this.points[i].y + this.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, midX, midY);
    }

    ctx.lineTo(
      this.points[this.points.length - 1].x,
      this.points[this.points.length - 1].y
    );
    ctx.stroke();
    ctx.restore();
  }

  // selection box logic separated
  drawSelectionBox(ctx: CanvasRenderingContext2D, camera: { x: number; y: number; scale: number }): void {
    const { minX, minY, maxX, maxY } = this.getBounds();

    ctx.save();
    ctx.strokeStyle = "blue";
    // ctx.setLineDash([4, 2]);
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

    const size = Shape.HANDLE_SIZE / camera.scale;
    ctx.fillStyle = "white";
    ctx.setLineDash([]);
     ctx.lineWidth = 1 / camera.scale; 
    for (const h of this.getHandles()) {
      ctx.fillRect(h.x - size / 2, h.y - size / 2, size, size);
      ctx.strokeRect(h.x - size / 2, h.y - size / 2, size, size);
    }
    ctx.restore();
  }

  // bounds helpers required by Drawable
  getLeft(): number {
    return this.getBounds().minX;
  }
  getRight(): number {
    return this.getBounds().maxX;
  }
  getTop(): number {
    return this.getBounds().minY;
  }
  getBottom(): number {
    return this.getBounds().maxY;
  }

  private getBounds() {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of this.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    return { minX, minY, maxX, maxY };
  }

getHandles() {
  const { minX, minY, maxX, maxY } = this.getBounds();
  return [
    { name: "top-left", x: minX, y: minY },
    { name: "top-right", x: maxX, y: minY },
    { name: "bottom-left", x: minX, y: maxY },
    { name: "bottom-right", x: maxX, y: maxY },
  ];
}


  move(dx: number, dy: number): void {
    this.points = this.points.map((p) => ({
      x: p.x + dx,
      y: p.y + dy,
    }));
  }

 resize(handle: string, mouseX: number, mouseY: number): void {
  const { minX, minY, maxX, maxY } = this.getBounds();

  let scaleX = 1, scaleY = 1;
  let offsetX = minX, offsetY = minY;

  switch (handle) {
    case "top-left":
      scaleX = (maxX - mouseX) / (maxX - minX);
      scaleY = (maxY - mouseY) / (maxY - minY);
      offsetX = maxX;
      offsetY = maxY;
      break;
    case "top-right":
      scaleX = (mouseX - minX) / (maxX - minX);
      scaleY = (maxY - mouseY) / (maxY - minY);
      offsetX = minX;
      offsetY = maxY;
      break;
    case "bottom-left":
      scaleX = (maxX - mouseX) / (maxX - minX);
      scaleY = (mouseY - minY) / (maxY - minY);
      offsetX = maxX;
      offsetY = minY;
      break;
    case "bottom-right":
      scaleX = (mouseX - minX) / (maxX - minX);
      scaleY = (mouseY - minY) / (maxY - minY);
      offsetX = minX;
      offsetY = minY;
      break;
  }

  this.points = this.points.map((p) => ({
    x: offsetX + (p.x - offsetX) * scaleX,
    y: offsetY + (p.y - offsetY) * scaleY,
  }));
}


  // extra for eraser
  isPointNear(x: number, y: number, threshold = 5): boolean {
    return this.points.some((p) => Math.hypot(p.x - x, p.y - y) <= threshold);
  }
}


// Shirley Musk
// Karolayn_Matos