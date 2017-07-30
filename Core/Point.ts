import { MathHelper } from "./MathHelper";
import { Vector2D } from "./Vector2D";
import { Rect } from "./Rect";

export class Point {
    static readonly zero = new Point(0, 0);
    static readonly one = new Point(1, 1);
    static readonly four = new Point(4, 4);
    static readonly eight = new Point(8, 8);
    static readonly sixteen = new Point(16, 16);

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toVector2D(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    round(): Point {
        return new Point(Math.round(this.x), Math.round(this.y));
    }

    floor(): Point {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    }

    add(other: Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }

    minus(other: Point): Point {
        return new Point(this.x - other.x, this.y - other.y);
    }

    divide(amount: number): Point {
        return new Point(this.x / amount, this.y / amount);
    }

    multiply(amount: number): Point {
        return new Point(this.x * amount, this.y * amount);
    }

    static lerp = (value1: Point, value2: Point, amount: number) => {
        return new Point(
            MathHelper.lerp(value1.x, value2.x, amount),
            MathHelper.lerp(value1.y, value2.y, amount));
    }

    toString(): string {
        return `${Math.floor(this.x)}, ${Math.floor(this.y)}`;
    }

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y;
    }

    static areNear(first: Point, second: Point, range: number) {
        let r1 = new Rect(first, Vector2D.one);
        r1 = r1.expand(range);
        
        let r2 = new Rect(second, Vector2D.one);
        r2 = r2.expand(range);

        return Rect.intersects(r1,r2);
    }

    static distanceBetween(p1: Point, p2: Point): number {

        const a = p1.x - p2.x;
        const b = p1.y - p2.y;

        return Math.sqrt(a * a + b * b);
    }    
}
