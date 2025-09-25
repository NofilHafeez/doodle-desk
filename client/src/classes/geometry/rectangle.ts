import { Point } from "../geometry/point";
import { Shape } from "../shape";
import type { Drawable } from '../../type/drawable';
// import { worldToScreen } from '../../helper/helperFunc';


export class Rectangle extends Shape implements Drawable {
  topLeft: Point;
  width: number;
  height: number;

  constructor(
    topLeft: Point,
    width: number,
    height: number,
    color: string,
    name: string = "rectangle",
    strokeWidth: number,
    fillColor: string,
    strokeStyle: number[]
  ) {
    super(color, name, strokeWidth, fillColor, strokeStyle);
    this.topLeft = topLeft;
    this.width = width;
    this.height = height; 
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.strokeWidth;
    ctx.setLineDash(this.strokeStyle);
    ctx.roundRect(
      this.topLeft.getX(),
      this.topLeft.getY(),
      this.width,
      this.height,
      10
    );

    if (this.fillColor && this.fillColor !== "transparent") {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    ctx.stroke();
  }

 drawSelectionBox(ctx: CanvasRenderingContext2D, camera: { x: number; y: number; scale: number }) {
  ctx.save();

  // World coordinates directly
  const left   = this.getLeft();
  const top    = this.getTop();
  const right  = this.getRight();
  const bottom = this.getBottom();

  ctx.strokeStyle = "blue";
  ctx.setLineDash([]);
  ctx.lineWidth = 1 / camera.scale; // keep 1px thickness regardless of zoom
  ctx.strokeRect(left, top, right - left, bottom - top);

  // Handles also in world coords
  const size = Shape.HANDLE_SIZE / camera.scale; // constant screen size
  const half = size / 2;

  ctx.fillStyle = "white";
  ctx.strokeStyle = "blue";
  ctx.setLineDash([]);

  this.getHandles().forEach(h => {
    ctx.fillRect(h.x - half, h.y - half, size, size);
    ctx.strokeRect(h.x - half, h.y - half, size, size);
  });

  ctx.restore();
}

  getHandles() {  
    const left = this.getLeft();
    const right = this.getRight();
    const top = this.getTop();
    const bottom = this.getBottom();
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;

    return [
      { name: "top-left", x: left, y: top },
      { name: "top-right", x: right, y: top },
      { name: "bottom-left", x: left, y: bottom },
      { name: "bottom-right", x: right, y: bottom },
      { name: "top-center", x: cx, y: top },
      { name: "bottom-center", x: cx, y: bottom },
      { name: "left-center", x: left, y: cy },
      { name: "right-center", x: right, y: cy },
    ];
  }

  getLeft() {
    return this.topLeft.getX();
  }
  getRight() {
    return this.topLeft.getX() + this.width;
  }
  getTop() {
    return this.topLeft.getY();
  }
  getBottom() {
    return this.topLeft.getY() + this.height;
  }


  move(dx: number, dy: number) {
    this.topLeft.x += dx;
    this.topLeft.y += dy;
  }

  resize(handle: string, mouseX: number, mouseY: number) {
    const left = this.getLeft();
    const right = this.getRight();
    const top = this.getTop();
    const bottom = this.getBottom();

    switch (handle) {
      // === Sides ===
      case "right-center": {
        this.width = mouseX - left;
        break;
      }
      case "left-center": {
        this.width = right - mouseX;
        this.topLeft.x = mouseX;
        break;
      }
      case "bottom-center": {
        this.height = mouseY - top;
        break;
      }
      case "top-center": {
        this.height = bottom - mouseY;
        this.topLeft.y = mouseY;
        break;
      }

      // === Corners ===
      case "top-left": {
        this.width = right - mouseX;
        this.height = bottom - mouseY;
        this.topLeft.x = mouseX;
        this.topLeft.y = mouseY;
        break;
      }
      case "top-right": {
        this.width = mouseX - left;
        this.height = bottom - mouseY;
        this.topLeft.y = mouseY;
        break;
      }
      case "bottom-left": {
        this.width = right - mouseX;
        this.height = mouseY - top;
        this.topLeft.x = mouseX;
        break;
      }
      case "bottom-right": {
        this.width = mouseX - left;
        this.height = mouseY - top;
        break;
      }
    }
  }


getBounds() {
  return {
    x: this.getLeft(),
    y: this.getTop(),
    width: this.getRight() - this.getLeft(),
    height: this.getBottom() - this.getTop(),
  };
}


}
