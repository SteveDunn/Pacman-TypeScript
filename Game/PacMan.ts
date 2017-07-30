import { Canvas, Sprite, Point, Vector2D, Keyboard, GameContext, TwoFrameAnimation } from "../Core/_exports";
import { Direction } from "./Direction";
import { DirectionToIndexLookup } from "./DirectionToIndexLookup";
import { Tile } from "./Tile";
import { IActor } from "./IActor";
import { TileContent } from "./TileContent";
import { MainWindow } from "./MainWindow";
import { Constants } from "./Constants";
import { DemoKeyPresses } from "./DemoKeyPresses";
import { LifeStatus } from "./LifeStatus";
import { KeyPressedEvent } from "./KeyPressedEvent";
import { FramePointers } from "./FramePointers";

export class PacMan extends Sprite implements IActor {
    static readonly facingLeftSpritesheetPos = new Point(455, 16);

    private readonly _spriteSheet: HTMLImageElement;
    private readonly _spriteSize = new Vector2D(15, 15);

    private _lastDemoKeyPressAt = Point.zero;

    private _pillEatenAt = Point.zero;

    private readonly _demoKeyPresses: DemoKeyPresses;
    private _visible: boolean;

    private _lifeStatus: LifeStatus;

    private _tile: Tile;
    private _canvasPosition: Point;
    private _spriteSheetPos: Point;

    private _keyPress: KeyPressedEvent;
    private _direction: Direction;
    private _framePointers: FramePointers[];

    private _dyingFrames: Point[];
    private _dyingFramePointer: number;

    private _frame1InSpriteMap: Point;
    private _frame2InSpriteMap: Point;
    private _animDirection: TwoFrameAnimation;

    private _speed = Constants.pacManBaseSpeed;

    private _isDemoMode: boolean;

    constructor() {

        super();

        this._demoKeyPresses = new DemoKeyPresses();

        this._lifeStatus = LifeStatus.Alive;

        this._tile = new Tile();

        this._keyPress = new KeyPressedEvent();
        this._spriteSheet = <HTMLImageElement>document.getElementById("spritesheet");
        this._framePointers = new Array<FramePointers>();

        const left = 456;
        const left2 = 472;

        this._framePointers[Direction.Up] = new FramePointers(
            new Point(left, 32), new Point(left2, 32));

        this._framePointers[Direction.Down] = new FramePointers(
            new Point(left, 48), new Point(left2, 48));

        this._framePointers[Direction.Left] = new FramePointers(
            new Point(left, 16), new Point(left2, 16));

        this._framePointers[Direction.Right] = new FramePointers(
            new Point(left, 0), new Point(left2, 0));

        this._dyingFrames = [];
        this._dyingFramePointer = 0;

        for (let i = 0; i < 12; i++) {
            this._dyingFrames.push(new Point(489 + (i * 16), 0));
        }

        this.reset();
    }

    reset(isDemoMode: boolean = false): void {
        this.visible = true;
        this._demoKeyPresses.reset();
        this._isDemoMode = isDemoMode;
        this._direction = Direction.Left;
        this._speed = Constants.pacManBaseSpeed;
        this._dyingFramePointer = 0;
        this.position = Tile.toCenterCanvas(new Vector2D(13.5, 23).toPoint());
        this._lifeStatus = LifeStatus.Alive;
        this._animDirection = new TwoFrameAnimation(65);
        this._frame1InSpriteMap = this._framePointers[this._direction].frame1InSpriteMap;
        this._frame2InSpriteMap = this._framePointers[this._direction].frame2InSpriteMap;
        this._spriteSheetPos = this._frame1InSpriteMap;
    }

    get lifeStatus(): LifeStatus {
        return this._lifeStatus;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
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

    getTile(): Tile {
        return this._tile;
    }

    getDirection(): Direction {
        return this._direction;
    }

    updateAnimation(context: GameContext): void {
        if (this._speed === 0) {
            return;
        }

        this._animDirection.run(context);
        this._frame1InSpriteMap = this._framePointers[this._direction].frame1InSpriteMap;
        this._frame2InSpriteMap = this._framePointers[this._direction].frame2InSpriteMap;

        if (this._animDirection.flag) {
            this._spriteSheetPos = this._frame1InSpriteMap;
        } else {
            this._spriteSheetPos = this._frame2InSpriteMap;
        }
    }

    handleDying() {
        this._dyingFramePointer += .15;

        if (this._dyingFramePointer > this._dyingFrames.length) {
            this._lifeStatus = LifeStatus.Dead;
        } else {
            this._spriteSheetPos = this._dyingFrames[Math.floor(this._dyingFramePointer)];
        }
    }

    get isDead() {
        return this._lifeStatus === LifeStatus.Dead;
    }

    get isAlive() {
        return this._lifeStatus === LifeStatus.Alive;
    }

    startDying() {
        this._lifeStatus = LifeStatus.Dying;
    }

    startDigesting() {
        this._lifeStatus = LifeStatus.BeingDigested;
    }

    update(context: GameContext): void {
        if (this._lifeStatus === LifeStatus.BeingDigested) {
            return;
        }

        if (this._lifeStatus === LifeStatus.Dying || this._lifeStatus === LifeStatus.Dead) {
            this.handleDying();
            return;
        }

        this.updateAnimation(context);

        if (this._tile.isNearCenter2(4)) {
            this.recordInput(context);

            this.recentreInLane();

            this.handleDirection();
        }

        if (this._tile.isNearCenter2(1.5)) {
            //this.position = this.tile.center;
            this.handleWhatIsUnderCell(context);
            this.handleWrapping();

            const can = MainWindow.actors.maze.canContinueInDirection(this._direction, this._tile);

            if (!can) {
                this._speed = 0;
            } else {
                //cheat
                //this.speed = 1;
                this._speed = Constants.pacManBaseSpeed;
            }
        }

        let speed = this._speed;

        const levelProps = MainWindow.gameStats.currentPlayerStats.levelStats.levelProps;
        const inPillCell = this._tile.index.equals(this._pillEatenAt);

        let pcToUse = inPillCell ? levelProps.pacManDotsSpeedPc : levelProps.pacManSpeedPc;

        if (MainWindow.gameStats.currentPlayerStats.isInFrightSession) {
            pcToUse = inPillCell ? levelProps.frightPacManDotSpeedPc : levelProps.frightPacManSpeedPc;
        }
        if (!inPillCell) {
            this._pillEatenAt = Point.zero;
        }

        speed = speed * (pcToUse / 100);

        const offset = DirectionToIndexLookup.indexVectorFor(this._direction).multiply(speed);

        this.position = this.position.add(offset.toPoint());
    }

    get position(): Point {
        return this._canvasPosition;
    }

    set position(pos: Point) {
        this._canvasPosition = pos;
        this._tile.set(pos);
    }

    pillEaten() {
        //this._justEatenPill = true;
        this._pillEatenAt = this._tile.index;
    }

    handleWrapping(): void {
        const nextTile = this._tile.nextTile(this._direction);

        if (nextTile.index.x < -1) {
            const newPos = Tile.fromIndex(nextTile.index.add(new Point(30, 0)));
            this._canvasPosition = newPos.center;
            this._tile.set(this._canvasPosition);
        } else if (nextTile.index.x > 29) {
            const newPos = Tile.fromIndex(nextTile.index.minus(new Point(30, 0)));
            this._canvasPosition = newPos.center;
            this._tile.set(this._canvasPosition);
        }
    }

    handleDirection(): void {
        if (MainWindow.actors.maze.canContinueInDirection(this._keyPress.direction, this._tile)) {
            //console.info(this.keyPress.direction);
            this._direction = this._keyPress.direction;
        }
    }

    handleWhatIsUnderCell(gameContext: GameContext): void {
        const contents = MainWindow.actors.maze.getTileContent(this._tile.index);

        if (contents === TileContent.Pill) {
            MainWindow.actors.maze.clearCell(this._tile.index);
            MainWindow.pillEaten(this._tile.index);
        }

        if (contents === TileContent.PowerPill) {
            MainWindow.actors.maze.clearCell(this._tile.index);
            MainWindow.powerPillEaten(this._tile.index);
        }
    }

    recordInput(context: GameContext): void {
        let requestedDirection = this._direction;

        if (this._isDemoMode) {
            if (this._tile.isNearCenter2(4) && !this._tile.index.equals(this._lastDemoKeyPressAt)) {
                const choices = MainWindow.actors.maze.getChoicesAtCellPosition(this._tile.index);

                choices.unset(this._direction);

                if (this._direction === Direction.Left) {
                    choices.unset(Direction.Right);
                }

                if (this._direction === Direction.Right) {
                    choices.unset(Direction.Left);
                }

                if (this._direction === Direction.Up) {
                    choices.unset(Direction.Down);
                }

                if (this._direction === Direction.Down) {
                    choices.unset(Direction.Up);
                }

                if (choices.possibilities >= 1) {
                    requestedDirection = this._demoKeyPresses.next();
                    this._keyPress.when = context.totalGameTime;
                    this._keyPress.direction = requestedDirection;

                    this._lastDemoKeyPressAt = this._tile.index;
                }
            }
        } else {
            if (GameContext.keyboard.isKeyDown(Keyboard.right)) {
                requestedDirection = Direction.Right;
            } else if (GameContext.keyboard.isKeyDown(Keyboard.left)) {
                requestedDirection = Direction.Left;
            } else if (GameContext.keyboard.isKeyDown(Keyboard.down)) {
                requestedDirection = Direction.Down;
            } else if (GameContext.keyboard.isKeyDown(Keyboard.up)) {
                requestedDirection = Direction.Up;
            }
        }

        this._keyPress.direction = requestedDirection;
        this._keyPress.when = context.totalGameTime;
    }

    draw(canvas: Canvas): void {
        if (this.visible) {
            canvas.drawSprite(this);
        }
    }

    //debt: SD: refactor into something common as this is also used for the ghosts
    recentreInLane() {
        const tileCenter = this._tile.center;

        const speed = this._speed;

        if (this._direction === Direction.Down || this._direction === Direction.Up) {
            const wayToMove = new Point(speed, 0);

            if (this.position.x > tileCenter.x) {
                this.position = this.position.minus(wayToMove);
                this.position = new Point(Math.max(this.position.x, tileCenter.x), this.position.y);
            } else if (this.position.x < tileCenter.x) {
                this.position = this.position.add(wayToMove);
                this.position = new Point(Math.min(this.position.x, tileCenter.x), this.position.y);
            }
        }

        if (this._direction === Direction.Left || this._direction === Direction.Right) {
            const wayToMove = new Point(0, speed);

            if (this.position.y > tileCenter.y) {
                this.position = this.position.minus(wayToMove);
                this.position = new Point(this.position.x, Math.max(this.position.y, tileCenter.y));
            } else if (this.position.y < tileCenter.y) {
                this.position = this.position.add(wayToMove);
                this.position = new Point(this.position.x, Math.min(this.position.y, tileCenter.y));
            }
        }
    }
}