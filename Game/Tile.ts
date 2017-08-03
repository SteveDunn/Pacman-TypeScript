import { Vector2D, Point } from "../Core/_exports";
import { Direction } from "./Direction";

export class Tile {
    private _index = Point.zero;
    private _topLeft = Point.zero;
    private _center = Point.zero;
    private _setWith = Point.zero;
    private _isInCenter: boolean;

    constructor() {
        this.set(Point.zero);
    }

    set(spritePos: Point): void {
        this._setWith = spritePos;
        this._index = spritePos.divide(8).floor();
        this._topLeft = this._index.multiply(8);
        this._center = this._topLeft.add(new Point(4, 4));
        this._isInCenter = this._center.equals(spritePos.round());
    }

    get index(): Point {
        return this._index;
    }

    get topLeft(): Point {
        return this._topLeft;
    }

    // get's the canvas center position
    get center(): Point {
        return this._center;
    }

    get isInCenter(): boolean {
        return Point.areNear(this._setWith, this._center, .75);
    }

    isNearCenter(precision: number): boolean {
        return Point.areNear(this._setWith, this._center, precision);
    }

    nextTile(direction: Direction): Tile {
        let offset = Point.zero;

        if (direction === Direction.Right) {
            offset = new Point(1, 0);
        } else if (direction === Direction.Left) {
            offset = new Point(-1, 0);
        } else if (direction === Direction.Up) {
            offset = new Point(0, -1);
        } else if (direction === Direction.Down) {
            offset = new Point(0, 1);
        }

        const tile = new Tile();

        tile.set(this._center.add(offset.multiply(8)));

        return tile;
    }

    nextTileWrapped(direction: Direction): Tile {
        let offset = Point.zero;

        if (direction === Direction.Right) {
            offset = new Point(1, 0);
        } else if (direction === Direction.Left) {
            offset = new Point(-1, 0);
        } else if (direction === Direction.Up) {
            offset = new Point(0, -1);
        } else if (direction === Direction.Down) {
            offset = new Point(0, 1);
        }

        let tile = new Tile();

        const newPos = this._center.add(offset.multiply(8));

        tile.set(newPos);

        tile = this.handleWrapping(tile);

        return tile;
    }

    handleWrapping(tile: Tile): Tile {
        if (tile.index.x <= -1) {
            return Tile.fromIndex(tile.index.add(new Point(29, 0)));
        } else if (tile.index.x >= 29) {
            return Tile.fromIndex(tile.index.minus(new Point(29, 0)));
        }

        return tile;
    }

    static toCenterCanvas(tilePos: Point): Point {
        return tilePos.multiply(8).add(Point.four);
    }

    // x & y might not be a round number
    static fromCell(x: number, y: number): Point {
        const centerCanvasPosition = new Vector2D(x, y).multiply(8);

        return centerCanvasPosition.divide(8).toPoint();
    }

    static fromIndex(index: Point): Tile {

        const tile = new Tile();
        tile.set(index.multiply(8));

        return tile;
    }

    toString(): string {
        return `set with=${this._setWith}, in center=${this._isInCenter} TL=${this._topLeft}, index=${this._index}`;
    }
}