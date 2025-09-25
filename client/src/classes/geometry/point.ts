export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    getX(): number {
        return this.x; 
    }

    getY(): number {
        return this.y; 
    }

    setX(x: number): void {
        this.x = x;
    }

    setY(y: number): void {
        this.y = y;
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);  
    }

    distanceTo(other: Point): number {
        return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }

}