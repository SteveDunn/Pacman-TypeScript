import { Point } from "./Point";
import { Vector2D } from "./Vector2D";

export class Rect {
    constructor(public readonly topLeft: Point, public readonly size: Vector2D) {
    }

    get top() {
        return this.topLeft.y;
    }

    get left() {
        return this.topLeft.x;
    }

    get right() {
        return this.topLeft.x + this.size.x;
    }

    get bottom() {
        return this.topLeft.y + this.size.y;
    }

    expand(amount: number): Rect {
        return new Rect(
            new Point(this.topLeft.x - amount, this.topLeft.y - amount),
            this.size.add(new Vector2D(amount, amount)));
    }

    static intersects(r1: Rect, r2: Rect): boolean {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }
}
