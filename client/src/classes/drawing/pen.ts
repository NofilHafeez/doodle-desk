// import {Point} from '../geometry/point';
// import type { Canvas } from './canvas';

// export class Pen {
//     cp: Point;
//     color: string;
//     width: number;
//     canvas: Canvas;

//     constructor(cp: Point, color: string = 'black', width: number = 1, canvas: Canvas) {
//         this.cp = cp;
//         this.color = color;
//         this.width = width;
//         this.canvas = canvas
//     }

//     lineTo(x: number, y: number): void {
//         const new_point = new Point(x, y);
//         this.canvas.add_line(this.cp, new_point);
//         this.cp = new_point;
//     }

//     RectangleTo(x: number, y: number, width: number, height: number): void {    
//         const topLeft = new Point(x, y);
//         this.canvas.add_rectangle(topLeft, width, height);
//     } 
    
//     DiamondTo(x: number, y: number, radiusx:number, radiusy: number): void {    
//         const center = new Point(x, y);
//         this.canvas.add_diamond(center, radiusx, radiusy);
//     }  

//     circleTo(x: number, y: number, radiusx: number, radiusy: number): void {
//         const center = new Point(x, y);
//         this.canvas.add_circle(center, radiusx, radiusy);
//     }

//      drawingTo(prevX: number, prevY: number, newX: number, newY: number): void {
//         // const center = new Point(x, y);
//         this.canvas.do_drawing(prevX, prevY, newX, newY);
//     }

// }