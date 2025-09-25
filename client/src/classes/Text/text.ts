import { Point } from "../geometry/point";
import type { Drawable } from "../../type/drawable";

export class Text implements Drawable {
  text: string;
  topLeft: Point;
  width: number;
  height: number; 
  textColor: string;

  constructor(
    text: string,
    topLeft: Point,
    width: number = 100,
    height: number = 40,
    textColor: string,

  ) {
    this.text = text;
    this.topLeft = topLeft;
    this.width = width;
    this.height = height;
    this.textColor = textColor 
  }

 draw(ctx: CanvasRenderingContext2D, showBox: boolean = false): void {
  ctx.save();
  ctx.font = "16px Arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = this.textColor

  

  const cx = this.getLeft() + this.width / 2;
  const cy = this.getTop() + this.height / 2;

  // Draw text
  ctx.fillText(this.text, cx, cy);

  // Draw bounding box like rectangle (optional)
  if (showBox) {
    ctx.strokeStyle = "blue";
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1;
    ctx.strokeRect(this.getLeft(), this.getTop(), this.width, this.height);
  }

  ctx.restore();
}


  drawSelectionBox(
    ctx: CanvasRenderingContext2D,
    camera: { x: number; y: number; scale: number }
  ) {
    ctx.save();

    const left = this.getLeft();
    const top = this.getTop();
    const right = this.getRight();
    const bottom = this.getBottom();

    ctx.strokeStyle = "blue";
    // ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1 / camera.scale;

   const width = right - left;
    const height = bottom - top;


  // normal selection box
  ctx.strokeRect(left, top, width, height);



    // Handles
    const size = 8 / camera.scale;
    const half = size / 2;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.setLineDash([]);

    this.getHandles().forEach((h) => {
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
    // this.width = bottom - top
    // this.height = right - left;


    switch (handle) {
      // Sides
      case "right-center":
        this.width = mouseX - left;
        break;
      case "left-center":
        this.width = right - mouseX;
        this.topLeft.x = mouseX;
        break;
      case "bottom-center":
        this.height = mouseY - top;
        break;
      case "top-center":
        this.height = bottom - mouseY;
        this.topLeft.y = mouseY;
        break;

      // Corners
      case "top-left":
        this.width = right - mouseX;
        this.height = bottom - mouseY;
        this.topLeft.x = mouseX;
        this.topLeft.y = mouseY;
        break;
      case "top-right":
        this.width = mouseX - left;
        this.height = bottom - mouseY;
        this.topLeft.y = mouseY;
        break;
      case "bottom-left":
        this.width = right - mouseX;
        this.height = mouseY - top;
        this.topLeft.x = mouseX;
        break;
      case "bottom-right":
        this.width = mouseX - left;
        this.height = mouseY - top;
        break;
    }
  }

  editText(newText: string) {
  if (typeof newText === "string" && newText.trim() !== "") {
    this.text = newText;
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
