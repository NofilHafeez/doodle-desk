import { Shape } from '../shape';
import { Point } from '../geometry/point';
import type { Drawable } from '../../type/drawable';
// import { worldToScreen } from '../../helper/helperFunc';
 
export class Circle extends Shape implements Drawable {
  radiusx: number;
  radiusy: number;
  center: Point;

  constructor(
    center: Point,
    radiusx: number,
    radiusy: number,
    color: string,
    name: string = "circle",
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
    ctx.ellipse(
      this.center.getX(),
      this.center.getY(),
      this.radiusx,
      this.radiusy,
      0,
      0,
      2 * Math.PI
    );
    if (this.fillColor && this.fillColor !== "transparent") {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
    ctx.stroke();

    // this.drawSelectionBox(ctx);
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


  getLeft() { return this.center.getX() - this.radiusx; }
  getRight() { return this.center.getX() + this.radiusx; }
  getTop() { return this.center.getY() - this.radiusy; }
  getBottom() { return this.center.getY() + this.radiusy; }

  move(x: number, y: number) {
    this.center.x += x;
    this.center.y += y;
  }

  
resize(handle: string, mouseX: number, mouseY: number) {
  switch (handle) {
    // === Sides ===
    case "right-center": {
      const leftX = this.center.x - this.radiusx;
      this.radiusx = Math.abs(mouseX - leftX) / 2;
      this.center.x = (leftX + mouseX) / 2;
      break;
    }
    case "left-center": {
      const rightX = this.center.x + this.radiusx;
      this.radiusx = Math.abs(rightX - mouseX) / 2;
      this.center.x = (rightX + mouseX) / 2;
      break;
    }
    case "bottom-center": {
      const topY = this.center.y - this.radiusy;
      this.radiusy = Math.abs(mouseY - topY) / 2;
      this.center.y = (topY + mouseY) / 2;
      break;
    }
    case "top-center": {
      const bottomY = this.center.y + this.radiusy;
      this.radiusy = Math.abs(bottomY - mouseY) / 2;
      this.center.y = (bottomY + mouseY) / 2;
      break;
    }

    // === Corners ===
    case "top-left": {
      const rightX = this.center.x + this.radiusx;
      const bottomY = this.center.y + this.radiusy;
      this.radiusx = Math.abs(rightX - mouseX) / 2;
      this.center.x = (rightX + mouseX) / 2;
      this.radiusy = Math.abs(bottomY - mouseY) / 2;
      this.center.y = (bottomY + mouseY) / 2;
      break;
    }
    case "top-right": {
      const leftX = this.center.x - this.radiusx;
      const bottomY = this.center.y + this.radiusy;
      this.radiusx = Math.abs(mouseX - leftX) / 2;
      this.center.x = (leftX + mouseX) / 2;
      this.radiusy = Math.abs(bottomY - mouseY) / 2;
      this.center.y = (bottomY + mouseY) / 2;
      break;
    }
    case "bottom-left": {
      const rightX = this.center.x + this.radiusx;
      const topY = this.center.y - this.radiusy;
      this.radiusx = Math.abs(rightX - mouseX) / 2;
      this.center.x = (rightX + mouseX) / 2;
      this.radiusy = Math.abs(mouseY - topY) / 2;
      this.center.y = (topY + mouseY) / 2;
      break;
    }
    case "bottom-right": {
      const leftX = this.center.x - this.radiusx;
      const topY = this.center.y - this.radiusy;
      this.radiusx = Math.abs(mouseX - leftX) / 2;
      this.center.x = (leftX + mouseX) / 2;
      this.radiusy = Math.abs(mouseY - topY) / 2;
      this.center.y = (topY + mouseY) / 2;
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

