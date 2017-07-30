import { FramePair, Canvas, Sprite, Point, Vector2D, GameContext, TwoFrameAnimation } from "../Core/_exports";
import { Tile, Direction } from "../Game/_exports";

export class AttractScenePacMan extends Sprite {
    visible: boolean = true;

    private readonly _spriteSheet: HTMLImageElement;
    private readonly _spriteSize = new Vector2D(16, 16);
    private readonly _veolocitiesLookup: FramePair[];

    private _canvasPosition: Point;
    private _spriteSheetPos: Point;

    private _direction: Direction;
    private _frame1InSpriteMap: Point;
    private _frame2InSpriteMap: Point;
    private _animDirection = new TwoFrameAnimation(65);

    private _speed: number = .5;

    constructor() {

        super();

        this._spriteSheet = <HTMLImageElement>document.getElementById("spritesheet");
        this._veolocitiesLookup = new Array<FramePair>();
        this._direction = Direction.Left;

        const left: number = 456;
        const left2: number = 472;

        this._veolocitiesLookup[Direction.Up] = new FramePair(
            new Point(left, 32), new Point(left2, 32));

        this._veolocitiesLookup[Direction.Down] = new FramePair(
            new Point(left, 48), new Point(left2, 48));

        this._veolocitiesLookup[Direction.Left] = new FramePair(
            new Point(left, 16), new Point(left2, 16));

        this._veolocitiesLookup[Direction.Right] = new FramePair(
            new Point(left, 0), new Point(left2, 0));

        this.position = Tile.toCenterCanvas(new Vector2D(13.5, 23).toPoint());

        this.setSpriteSheetPointers();
    }

    get spriteSheet(): HTMLImageElement {
        return this._spriteSheet;
    }

    get spriteSheetPos(): Point {
        return this._spriteSheetPos;
    }

    get size(): Vector2D {
        return this._spriteSize;
    }

    get origin(): Point {
        return Point.eight;
    }

    get direction() {
        return this._direction;
    }

    set direction(direction: Direction) {
        this._direction = direction;
    }

    updateAnimation(context: GameContext): void {
        if (this._speed === 0) {
            return;
        }

        this._animDirection.run(context);

        this.setSpriteSheetPointers();
    }

    private setSpriteSheetPointers(): void {
        this._frame1InSpriteMap = this._veolocitiesLookup[this._direction].first;
        this._frame2InSpriteMap = this._veolocitiesLookup[this._direction].second;

        if (this._animDirection.flag) {
            this._spriteSheetPos = this._frame1InSpriteMap;
        } else {
            this._spriteSheetPos = this._frame2InSpriteMap;
        }
    }

    update(context: GameContext): void {
        this.updateAnimation(context);
    }

    get position(): Point {
        return this._canvasPosition;
    }

    set position(pos: Point) {
        this._canvasPosition = pos;
    }

    draw(canvas: Canvas): void {
        if(!this.visible){
            return ;
        }

        canvas.drawSprite(this);
    }
}