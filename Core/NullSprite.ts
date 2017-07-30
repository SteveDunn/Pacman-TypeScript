import {Vector2D} from "./Vector2D";
import {Point} from "./Point";
import { GeneralSprite } from "./GeneralSprite";

export class NullSprite extends GeneralSprite {
    constructor() {
        super(Point.zero, Vector2D.zero, Point.zero, Point.zero);
    }
}