import { Point } from '../geometry/point';
import { Line } from '../geometry/line';
import { Circle } from '../geometry/circle';
import { Rectangle } from '../geometry/rectangle';
import { Diamond } from '../geometry/diamond';
import { drawingBrush } from './drawingBrush';
import { ShapesStorage } from '../shapeStorage/storage';
import { Text } from '../Text/text';
import { Utility } from '../Utility/utility';

export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  storage: ShapesStorage;
  camera = { x: 0, y: 0, scale: 1 };
  activeBrush: drawingBrush | null = null;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) throw new Error(`Canvas with id ${canvasId} not found`);

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.storage = new ShapesStorage();

    // Load shapes from localStorage
    this.storage.loadFromLocal({
      rectangle: (data) =>
        new Rectangle(
          new Point(data.topLeft.x, data.topLeft.y),
          data.width,
          data.height,
          data.color ?? "black",
          "rectangle",
          data.strokeWidth ?? 1,
          data.fillColor ?? "transparent",
          data.strokeStyle ?? [0, 0]
        ),
      text: (data) =>
        new Text(
          data.text,
          new Point(data.topLeft.x, data.topLeft.y),
          data.width,
          data.height,
          data.textColor ?? "black"
        ),
      circle: (data) =>
        new Circle(
          new Point(data.center.x, data.center.y),
          data.radiusx,
          data.radiusy,
          data.color ?? "black",
          "circle",
          data.strokeWidth ?? 1,
          data.fillColor ?? "transparent",
          data.strokeStyle ?? [0, 0]
        ),
      line: (data) =>
        new Line(
          new Point(data.start.x, data.start.y),
          new Point(data.end.x, data.end.y),
          data.color ?? "black",
          "line",
          data.strokeWidth ?? 1,
          data.fillColor ?? "transparent",
          data.strokeStyle ?? [0, 0]
        ),
      diamond: (data) =>
        new Diamond(
          new Point(data.center.x, data.center.y),
          data.radiusx,
          data.radiusy,
          data.color ?? "black",
          "diamond",
          data.strokeWidth ?? 1,
          data.fillColor ?? "transparent",
          data.strokeStyle ?? [0, 0]
        ),
      draw: (data) => {
        const brush = new drawingBrush(
          data.points[0].x,
          data.points[0].y,
          data.color,
          data.strokeWidth
        );
        for (let i = 1; i < data.points.length; i++) {
          brush.addPoint(data.points[i].x, data.points[i].y);
        }
        return brush;
      }
    });
  }


  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // --- Add Shapes ---
  add_line(p1: Point, p2: Point, color: string, stroke: number, strokeStyle: number[]): void {
    this.storage.add({
      id:  Utility.generateId(),
      type: "line",
      shape: new Line(p1, p2, color, "line", stroke, "transparent", strokeStyle)
    });
  }

  add_circle(center: Point, radiusx: number, radiusy: number, color: string, stroke: number, fill: string, strokeStyle: number[]): void {
    this.storage.add({
      id: Utility.generateId(),
      type: "circle",
      shape: new Circle(center, radiusx, radiusy, color, "circle", stroke, fill, strokeStyle)
    });
  }

  add_rectangle(topLeft: Point, width: number, height: number, color: string, stroke: number, fill: string, strokeStyle: number[]): void {
    this.storage.add({
      id:  Utility.generateId(),
      type: "rectangle",
      shape: new Rectangle(topLeft, width, height, color, "rectangle", stroke, fill, strokeStyle)
    });
  }

  add_text(text: string, topLeft: Point, width: number, height: number, color: string): void {
    this.storage.add({
      id:  Utility.generateId(),
      type: "text",
      shape: new Text(text, topLeft, width, height, color)
    });
  }

  add_diamond(center: Point, radiusx: number, radiusy: number, color: string, stroke: number, fill: string, strokeStyle: number[]): void {
    this.storage.add({
      id:  Utility.generateId(),
      type: "diamond",
      shape: new Diamond(center, radiusx, radiusy, color, "diamond", stroke, fill, strokeStyle)
    });
  }

  // --- Drawing ---
  draw(selectedShapeId?: number): void {
    this.clear();
    this.ctx.save();
    this.ctx.setTransform(
      this.camera.scale, 0, 0, this.camera.scale,
      -this.camera.x * this.camera.scale,
      -this.camera.y * this.camera.scale
    );

    for (const shape of this.storage.shapes) {
      shape.shape.draw(this.ctx);
      if (shape.id === selectedShapeId) {
        shape.shape.drawSelectionBox(this.ctx, this.camera);
      }
    }

    this.ctx.restore();
  }

  // --- Shape Management ---
  findShapeAt(x: number, y: number) {
    this.ctx.save();
    // const tx = (x + this.camera.x * this.camera.scale) / this.camera.scale;
    // const ty = (y + this.camera.y * this.camera.scale) / this.camera.scale;

    for (let i = this.storage.shapes.length - 1; i >= 0; i--) {
      const item = this.storage.shapes[i];
      const s = item.shape;
      this.ctx.beginPath();

      if (item.type === "circle" && s instanceof Circle) {
        this.ctx.ellipse(s.center.getX(), s.center.getY(), s.radiusx, s.radiusy, 0, 0, 2 * Math.PI);
      } else if (item.type === "rectangle" && s instanceof Rectangle) {
        this.ctx.rect(s.topLeft.getX(), s.topLeft.getY(), s.width, s.height);
      } else if (item.type === "line" && s instanceof Line) {
        this.ctx.moveTo(s.start.getX(), s.start.getY());
        this.ctx.lineTo(s.end.getX(), s.end.getY());
      } else if (item.type === "diamond" && s instanceof Diamond) {
        const cx = s.center.getX(), cy = s.center.getY();
        this.ctx.moveTo(cx, cy - s.radiusy);
        this.ctx.lineTo(cx + s.radiusx, cy);
        this.ctx.lineTo(cx, cy + s.radiusy);
        this.ctx.lineTo(cx - s.radiusx, cy);
        this.ctx.closePath();
      } else if (item.type === "text" && s instanceof Text) {
        this.ctx.rect(s.getLeft(), s.getTop(), s.width, s.height);
      } else if (item.type === "draw" && s instanceof drawingBrush) {
        if (s.points.length > 1) {
          this.ctx.moveTo(s.points[0].x, s.points[0].y);
          for (let j = 1; j < s.points.length - 1; j++) {
            const midX = (s.points[j].x + s.points[j + 1].x) / 2;
            const midY = (s.points[j].y + s.points[j + 1].y) / 2;
            this.ctx.quadraticCurveTo(s.points[j].x, s.points[j].y, midX, midY);
          }
          this.ctx.lineTo(s.points[s.points.length - 1].x, s.points[s.points.length - 1].y);
        }
        this.ctx.lineWidth = s.strokeWidth || 1;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
      }

      if (this.ctx.isPointInPath(x, y) || this.ctx.isPointInStroke(x, y)) {
        this.ctx.restore();
        return item;
      }
    }

    this.ctx.restore();
    return null;
  }

  removeShape(id: number) {
    this.storage.remove(id);
    this.draw();
  }

  getShapeById(id: number) {
    return this.storage.shapes.find(shape => shape.id === id) || null;
  }

  // --- Brush Tools ---
  startBrush(x: number, y: number, color: string, stroke: number) {
    this.activeBrush = new drawingBrush(x, y, color, stroke);
    this.storage.add({
      id:  Utility.generateId(),
      type: "draw",
      shape: this.activeBrush
    });
  }

  updateBrush(x: number, y: number) {
    if (this.activeBrush) {
      this.activeBrush.addPoint(x, y);
      this.draw();
    }
  }

  endBrush() {
    this.activeBrush = null;
  }
}
