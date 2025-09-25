import { Point } from "./point";
import { Shape } from "../shape";
import type { Drawable } from '../../type/drawable';
// import { worldToScreen } from '../../helper/helperFunc';


export class Diamond extends Shape implements Drawable {
  center: Point;
  radiusx: number;
  radiusy: number;

  constructor(
    center: Point,
    radiusx: number,
    radiusy: number,
    color: string,
    name: string = "diamond",
    strokeWidth: number,
    fillColor: string,
    strokeStyle: number[]
  ) {
    super(color, name, strokeWidth, fillColor, strokeStyle);
    this.center = center;
    this.radiusx = radiusx;
    this.radiusy = radiusy;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.strokeWidth;
    ctx.setLineDash(this.strokeStyle);
    ctx.moveTo(this.center.getX(), this.center.getY() - this.radiusy); // Top
    ctx.lineTo(this.center.getX() + this.radiusx, this.center.getY()); // Right
    ctx.lineTo(this.center.getX(), this.center.getY() + this.radiusy); // Bottom
    ctx.lineTo(this.center.getX() - this.radiusx, this.center.getY()); // Left
    ctx.closePath();

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

  move(dx: number, dy: number) {
    this.center.x += dx;
    this.center.y += dy;
  }

  getLeft() {
    return this.center.getX() - this.radiusx;
  }
  getRight() {
    return this.center.getX() + this.radiusx;
  }
  getTop() {
    return this.center.getY() - this.radiusy;
  }
  getBottom() {
    return this.center.getY() + this.radiusy;
  }



  resize(handle: string, mouseX: number, mouseY: number) {
  switch (handle) {
    // === Sides ===
    case "right-center": {
      this.radiusx = Math.abs(mouseX - this.center.x);
      break;
    }
    case "left-center": {
      this.radiusx = Math.abs(this.center.x - mouseX);
      break;
    }
    case "bottom-center": {
      this.radiusy = Math.abs(mouseY - this.center.y);
      break;
    }
    case "top-center": {
      this.radiusy = Math.abs(this.center.y - mouseY);
      break;
    }

    // === Corners ===
    case "top-left": {
      this.radiusx = Math.abs(this.center.x - mouseX);
      this.radiusy = Math.abs(this.center.y - mouseY);
      break;
    }
    case "top-right": {
      this.radiusx = Math.abs(mouseX - this.center.x);
      this.radiusy = Math.abs(this.center.y - mouseY);
      break;
    }
    case "bottom-left": {
      this.radiusx = Math.abs(this.center.x - mouseX);
      this.radiusy = Math.abs(mouseY - this.center.y);
      break;
    }
    case "bottom-right": {
      this.radiusx = Math.abs(mouseX - this.center.x);
      this.radiusy = Math.abs(mouseY - this.center.y);
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
