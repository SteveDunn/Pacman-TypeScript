import { GeneralSprite, Point, Vector2D } from "../Core/_exports";

export class Pill extends GeneralSprite {
    constructor() {
        super(Point.zero, Vector2D.eight, Point.four, new Point(8, 8));
    }
}