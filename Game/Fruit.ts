import { Canvas, EggTimer, GameContext, Point, Sprite, Vector2D } from "../Core/_exports";
import { Tile } from "./Tile";
import { MainWindow } from "./MainWindow";
import { FruitItem } from "./FruitItem";


export class SimpleFruit extends Sprite {

    private readonly _spriteSheet: HTMLImageElement;
  
    private readonly _spriteSize = new Vector2D(14, 14);

    private _canvasPosition: Point;
    private _spriteSheetPos: Point;

    constructor() {

        super();

        this._spriteSheet = <HTMLImageElement>document.getElementById("spritesheet");
        this.position = Point.zero;

        this.setFruitItem(FruitItem.Apple);
    }

    setFruitItem(item: FruitItem) {
        const x = 16 * item;

        this._spriteSheetPos = new Point(490 + x, 50);
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

    update(context: GameContext): void {
    }

    get position(): Point {
        return this._canvasPosition;
    }

    set position(pos: Point) {
        this._canvasPosition = pos;
    }

    draw(canvas: Canvas): void {
            canvas.drawSprite(this);
    }
}

export class Fruit extends SimpleFruit {

    private _visible: boolean;

    private readonly _showTimer: EggTimer;

    constructor() {
        super();

        this._showTimer = new EggTimer(10000, () => { this.visible = false; });

        this.position = Tile.toCenterCanvas(new Vector2D(14, 17.2).toPoint());

        this.reset();
    }

    reset(isDemoMode: boolean = false): void {
        this.visible = false;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = value;
    }

    update(context: GameContext): void {
        if (this.visible) {
            this._showTimer.run(context.elapsed);
            if (Point.areNear(MainWindow.actors.pacMan.position, this.position, 4)) {
                MainWindow.fruitEaten();

                this.visible = false;
            }
            return;
        }

        const levelStats = MainWindow.gameStats.currentPlayerStats.levelStats;

        if (levelStats.fruitSession.shouldShow) {

            this.visible = true;
            this._showTimer.reset();
        }

        this.setFruitItem(levelStats.levelProps.fruit);
    }

    draw(canvas: Canvas): void {
        if (this.visible) {
            super.draw(canvas);
        }
    }
}