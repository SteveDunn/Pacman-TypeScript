import { MathHelper } from "./MathHelper";
import { Point } from "./Point";

export class Vector2D {
    static readonly half = new Vector2D(.5, .5);
    static readonly zero = new Vector2D(0, 0);
    static readonly one = new Vector2D(1, 1);
    static readonly two = new Vector2D(2, 2);
    static readonly four = new Vector2D(4, 4);
    static readonly eight = new Vector2D(8, 8);
    static readonly sixteen = new Vector2D(16, 16);

    static readonly unitX = new Vector2D(1, 0);
    static readonly unitY = new Vector2D(0, 1);

    constructor(public x: number, public y: number) {
    }

    toPoint(): Point {
        return new Point(this.x, this.y);
    }

    copy(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    add(other: Vector2D): Vector2D {
        return new Vector2D(this.x + other.x, this.y + other.y);
    }

    minus(other: Vector2D): Vector2D {
        return new Vector2D(this.x - other.x, this.y - other.y);
    }

    divide(amount: number): Vector2D {
        return new Vector2D(this.x / amount, this.y / amount);
    }

    multiply(amount: number): Vector2D {
        return new Vector2D(this.x * amount, this.y * amount);
    }

    toString(): string {
        return `${Math.floor(this.x)}, ${Math.floor(this.y)}`;
    }

    equals(other: Vector2D): boolean {
        return this.x === other.x && this.y === other.y;
    }

    floor(): Vector2D {
        return new Vector2D(Math.floor(this.x), Math.floor(this.y));
    }

    round(): Vector2D {
        return new Vector2D(Math.round(this.x), Math.round(this.y));
    }

    static barycentric = (value1: Vector2D, value2: Vector2D, value3: Vector2D, amount1: number, amount2: number) => {
        return new Vector2D(
            MathHelper.barycentric(value1.x, value2.x, value3.x, amount1, amount2),
            MathHelper.barycentric(value1.y, value2.y, value3.y, amount1, amount2));
    }


    static clamp = (value1: Vector2D, min: Vector2D, max: Vector2D) => {
        return new Vector2D(
            MathHelper.clamp(value1.x, min.x, max.x),
            MathHelper.clamp(value1.y, min.y, max.y));
    }

    static distance = (value1: Vector2D, value2: Vector2D) => {
        const v1 = value1.x - value2.x;
        const v2 = value1.y - value2.y;
        return Math.sqrt((v1 * v1) + (v2 * v2));
    }

    static distanceSquared = (value1: Vector2D, value2: Vector2D) => {
        const v1 = value1.x - value2.x;
        const v2 = value1.y - value2.y;
        return (v1 * v1) + (v2 * v2);
    }

    static divide = (value1: Vector2D, divider: number) => {
        const factor = 1 / divider;
        value1.x *= factor;
        value1.y *= factor;
        return value1;
    }

    length = (): number => {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    lengthSquared = () => {
        return (this.x * this.x) + (this.y * this.y);
    }

    static max = (value1: Vector2D, value2: Vector2D) => {
        return new Vector2D(value1.x > value2.x ? value1.x : value2.x,
            value1.y > value2.y ? value1.y : value2.y);
    }

    static min = (value1: Vector2D, value2: Vector2D) => {
        return new Vector2D(value1.x < value2.x ? value1.x : value2.x,
            value1.y < value2.y ? value1.y : value2.y);
    }

    static negate = (value: Vector2D) => {
        value.x = -value.x;
        value.y = -value.y;
        return value;
    }

    static centerOf = (first: Vector2D, second: Vector2D): Vector2D => {
        return first.add(second.minus(first).divide(2));
    }

    normalize = () => {
        const val = 1.0 / Math.sqrt((this.x * this.x) + (this.y * this.y));
        this.x *= val;
        this.y *= val;
    }

    static normalize = (value: Vector2D): Vector2D => {
        const val = 1.0 / Math.sqrt((value.x * value.x) + (value.y * value.y));
        value.x *= val;
        value.y *= val;
        return value;
    }

    static smoothStep = (value1: Vector2D, value2: Vector2D, amount: number) => {
        return new Vector2D(
            MathHelper.smoothStep(value1.x, value2.x, amount),
            MathHelper.smoothStep(value1.y, value2.y, amount));
    }

    static distanceBetween(cell1: Vector2D, cell2: Vector2D): number {

        const a = cell1.x - cell2.x;
        const b = cell1.y - cell2.y;

        return Math.sqrt(a * a + b * b);
    }
}
