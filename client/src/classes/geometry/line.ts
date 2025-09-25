import { Point } from './point'
import { Shape } from '../shape'
import type { Drawable } from '../../type/drawable'; 
// import { worldToScreen } from '../../helper/helperFunc';
import { Helper } from '../Helper/helper';

export class Line extends Shape implements Drawable {
  start: Point
  end: Point

  constructor(
    start: Point,
    end: Point,
    color: string,
    name: string = 'line',
    strokeWidth: number,
    fillColor: string = "transparent",
    strokeStyle: number[]
  ) {
    super(color, name, strokeWidth, fillColor, strokeStyle)
    this.start = start
    this.end = end
  }

  draw(ctx: CanvasRenderingContext2D, camera?: { x: number; y: number; scale: number }): void {
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.strokeWidth
    ctx.setLineDash(this.strokeStyle)

    const s = camera ? Helper.worldToScreen(this.start.x, this.start.y, camera) : this.start
    const e = camera ? Helper.worldToScreen(this.end.x, this.end.y, camera) : this.end

    ctx.moveTo(s.x, s.y)
    ctx.lineTo(e.x, e.y)
    ctx.stroke()
  }

 drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  // camera: { x: number; y: number; scale: number }
): void {
  const size = Shape.HANDLE_SIZE;

  const start = this.start;
  const end = this.end;

  const half = size / 2;

  ctx.save();
  ctx.lineWidth = 1;
  ctx.setLineDash([]);

  // handles
  ctx.fillStyle = "white";
  ctx.strokeStyle = "blue";

  // start handle
  ctx.fillRect(start.x - half, start.y - half, size, size);
  ctx.strokeRect(start.x - half, start.y - half, size, size);

  // end handle
  ctx.fillRect(end.x - half, end.y - half, size, size);
  ctx.strokeRect(end.x - half, end.y - half, size, size);

  ctx.restore();
}


  getLeft() {
    return Math.min(this.start.x, this.end.x)
  }
  getRight() {
    return Math.max(this.start.x, this.end.x)
  }
  getTop() {
    return Math.min(this.start.y, this.end.y)
  }
  getBottom() {
    return Math.max(this.start.y, this.end.y)
  }

  len(): number {
    return this.start.distanceTo(this.end)
  }

  move(dx: number, dy: number) {
    this.start.x += dx
    this.start.y += dy
    this.end.x += dx
    this.end.y += dy
  }

  getHandles() {
    return [
      { x: this.start.x, y: this.start.y, name: "start" },
      { x: this.end.x, y: this.end.y, name: "end" }
    ]
  }

  resize(handle: string, mouseX: number, mouseY: number) {
    switch (handle) {
      case "start":
        this.start.x = mouseX
        this.start.y = mouseY
        break
      case "end":
        this.end.x = mouseX
        this.end.y = mouseY
        break
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
