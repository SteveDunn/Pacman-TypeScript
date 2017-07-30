import { PowerPill } from "./PowerPill";
import { Direction } from "./Direction";
import { DirectionChoices } from "./DirectionChoices";
import { MainWindow } from "./MainWindow";
import { Tile } from "./Tile";
import { TileContent } from "./TileContent";

import { LoopingTimer, Canvas, Sprite, Point, Vector2D, GameContext } from "../Core/_exports";

export class Maze extends Sprite {
    // the point where the ghost goes to just before going into chase/scatter mode
    static readonly tileHouseEntrance = Tile.fromIndex(new Point(13.5, 11));

    static readonly pixelHouseEntrancePoint = Tile.toCenterCanvas(new Vector2D(13.5, 11).toPoint());

    private static readonly spritesheetSize = new Vector2D(224, 248);

    // the point where the ghost goes to before going up and out of the house
    static readonly pixelCenterOfHouse = Tile.toCenterCanvas(new Vector2D(13.5, 14).toPoint());

    private static readonly specialIntersections: Point[] = [
        new Point(12, 11),
        new Point(15, 11),
        new Point(12, 26),
        new Point(15, 26)
    ];

    private static readonly powerPillPositions: Point[] = [
        new Point(2, 4),
        new Point(27, 4),
        new Point(2, 24),
        new Point(27, 24)
    ];

    private readonly _timer: LoopingTimer;

    private readonly _originalImage: HTMLImageElement;
    private readonly _directionChoices = new DirectionChoices();

    private _powerPill: PowerPill;
    private _flashing: boolean;
    private _offScreenCanvases: Canvas[];
    private _whiteMazeCanvas: Canvas;

    private _tickTock: boolean = true;

    constructor() {
        super();
        this._powerPill = new PowerPill();
        this._timer = new LoopingTimer(250, () => this._tickTock = !this._tickTock);

        this._originalImage = document.createElement("img");
        this._originalImage.src = "img/spritesheet.png";

        this._whiteMazeCanvas = Canvas.canvasFromImage(this._originalImage, new Point(228, 0), new Vector2D(234, 248));

        this._offScreenCanvases = [];
    }

    reset() {
        this._offScreenCanvases = [];
        for (let i: number = 0; i < MainWindow.gameStats.amountOfPlayers; i++) {
            this._offScreenCanvases.push(Canvas.canvasFromImage(this._originalImage));
        }
    }

    get spriteSheetPos(): Point {
        return Point.zero;
    }

    get size(): Vector2D {
        return Maze.spritesheetSize;
    }

    get spriteSheet(): HTMLImageElement {
        return this._originalImage;
    }

    get origin(): Point {
        return Point.zero;
    }

    get position(): Point {
        return Point.zero;
    }

    // special intersections have an extra restriction 
    // ghosts can not choose to turn upwards from these tiles.
    isSpecialIntersection(cell: Point): boolean {
        return cell.equals(Maze.specialIntersections[0]) ||
            cell.equals(Maze.specialIntersections[1]) ||
            cell.equals(Maze.specialIntersections[2]) ||
            cell.equals(Maze.specialIntersections[3]);
    };

    update(gameContext: GameContext): void {
        this._timer.run(gameContext.elapsed);
        this._powerPill.update(gameContext);
    }

    draw(canvas: Canvas): void {

        if (this._flashing) {
            if (this._tickTock) {
                canvas.drawOtherCanvas2(this._whiteMazeCanvas, Point.zero);
            } else {
                canvas.drawOtherCanvas2(
                    this._offScreenCanvases[MainWindow.gameStats.currentPlayerStats.playerIndex],
                    Point.zero);
            }

            return;
        }

        this.drawPowerPills();

        canvas.drawOtherCanvas2(
            this._offScreenCanvases[MainWindow.gameStats.currentPlayerStats.playerIndex],
            Point.zero);

        //    this.drawGrid(8, 8, canvas);
    }

    drawPowerPills() {
        Maze.powerPillPositions.forEach(p => {
            const playerStats = MainWindow.gameStats.currentPlayerStats;

            if (playerStats.levelStats.getCellContent(p.minus(Point.one)) === "*") {
                this._powerPill.position = p.multiply(8).minus(Point.four);
                this._offScreenCanvases[playerStats.playerIndex].drawSprite(this._powerPill);
            }
        });
    }

    clearCell(cell: Point) {
        const tl = Tile.fromIndex(cell).topLeft;

        this._offScreenCanvases[MainWindow.gameStats.currentPlayerStats.playerIndex]
            .fillRect("black", tl, Vector2D.eight);
    }

    isInTunnel(point: Point) {
        if (point.y !== 14) {
            return false;
        }

        if (point.x <= 5) {
            return true;
        }

        if (point.x >= 22) {
            return true;
        }

        return false;
    }

    drawGrid(w: number, h: number, canvas: Canvas): void {
        const underlyingCanvas = canvas.underlyingCanvas;
        underlyingCanvas.beginPath();

        for (let x: number = 0; x <= underlyingCanvas.canvas.width; x += w) {
            underlyingCanvas.moveTo(x, 0);
            underlyingCanvas.lineTo(x, underlyingCanvas.canvas.height);
        }
        for (let y: number = 0; y <= underlyingCanvas.canvas.height; y += h) {
            underlyingCanvas.moveTo(0, y);
            underlyingCanvas.lineTo(underlyingCanvas.canvas.width, y);
        }

        underlyingCanvas.strokeStyle = "#ff0000";
        underlyingCanvas.stroke();
    };

    canContinueInDirection(direction: Direction, tile: Tile): boolean {

        const nextTile = tile.nextTile(direction);

        return this.isCellNotAWall(nextTile.index);
    }

    getChoicesAtCellPosition(cellPos: Point): DirectionChoices {
        this._directionChoices.clear();

        if (this.isCellNotAWall(cellPos.add(new Point(-1, 0)))) {
            this._directionChoices.set(Direction.Left);
        }
        if (this.isCellNotAWall(cellPos.add(new Point(1, 0)))) {
            this._directionChoices.set(Direction.Right);
        }
        if (this.isCellNotAWall(cellPos.add(new Point(0, -1)))) {
            this._directionChoices.set(Direction.Up);
        }
        if (this.isCellNotAWall(cellPos.add(new Point(0, 1)))) {
            this._directionChoices.set(Direction.Down);
        }

        return this._directionChoices;
    }

    isCellNotAWall(cell: Point): boolean {
        return this.getTileContent(cell) !== TileContent.Wall;
    }

    startFlashing() {
        this._flashing = true;
    }

    stopFlashing() {
        this._flashing = false;
    }

    getTileContent(cell: Point): TileContent {

        const a = MainWindow.gameStats.currentPlayerStats.levelStats.getCellContent(cell);

        if (a === " ") {
            return TileContent.Wall;
        }

        if (a === "o") {
            return TileContent.Pill;
        }

        if (a === "*") {
            return TileContent.PowerPill;
        }

        if (a === "+") {
            return TileContent.Nothing;
        }

        return TileContent.Nothing;
        //throw new RangeError("Cell at ${cell.x}, ${cell.y} contained '${a}' - don't know what this is!");
    };

    getTopLeftCanvasPosition(cellPosition: Point): Point {
        return cellPosition.multiply(8);
    };

    highlightCell(canvas: Canvas, cell: Point, color: string): void {
        const topLeft = this.getTopLeftCanvasPosition(cell);
        canvas.fillRect(color, topLeft.minus(Point.one), new Vector2D(9, 9));
    }

    //todo: use clamp
    constrainCell(cell: Point): Point {

        let x = cell.x;
        let y = cell.y;

        x = x < 0 ? 0 : x;
        x = x > MazeBounds.dimensions.x ? MazeBounds.dimensions.x : x;

        y = y < 0 ? 0 : y;
        y = y > MazeBounds.dimensions.y ? MazeBounds.dimensions.y : y;

        return new Point(x, y);
    }

    isInPillCell(index: Point): boolean {
        return this.getTileContent(index) === TileContent.Pill;
    }
}

export class MazeBounds {
    static readonly topLeft = Point.zero;
    static readonly dimensions = new Vector2D(28, 30);
}
