import { Point } from "../Core/_exports";
import { Direction } from "../Game/_exports";

export class EyesSpritesheetInfo {
    private readonly _positions: Point[];

    private _width: number = 16;

    constructor(public position: Point) {
        this._positions = new Array<Point>();

        const toMove = new Point(this._width, 0);

        this._positions[Direction.Right] = position;

        let marker = position;
        marker = marker.add(toMove);

        this._positions[Direction.Left] = marker;
        marker = marker.add(toMove);

        this._positions[Direction.Up] = marker;
        marker = marker.add(toMove);

        this._positions[Direction.Down] = marker;
    }

    getSourcePosition(direction: Direction): Point {
        return this._positions[direction];
    }
}