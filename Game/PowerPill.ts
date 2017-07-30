import { GeneralSprite, Point, Vector2D } from "../Core/_exports";

export class PowerPill extends GeneralSprite {
    constructor() {
        super(Point.zero, Vector2D.eight, Point.four, new Point(457, 156), new Point(467, 156), 130 );
    }
}