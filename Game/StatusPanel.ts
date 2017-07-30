import { LoopingTimer, Canvas, Point, GameContext } from "../Core/_exports";

import { PacMan } from "./PacMan";
import { Engine } from "../Engine";
import { SimpleFruit } from "./Fruit";
import {MainWindow} from "./MainWindow";

export class StatusPanel {

    private readonly _creditTextPoint = new Point(10, 30);

    private readonly _timer: LoopingTimer;
    private readonly _spriteSheet: HTMLImageElement;

    private readonly _fruit: SimpleFruit;

    private _tickTock: boolean = true;

    constructor(private readonly _canvas: Canvas) {
        this._timer = new LoopingTimer(250, () => this._tickTock = !this._tickTock);
        this._spriteSheet = <HTMLImageElement>document.getElementById("spritesheet");
        this._fruit = new SimpleFruit();
    }

    update(context: GameContext) {
        this._timer.run(context.elapsed);
    }

    draw(): void {
        if (MainWindow.gameStats.anyonePlaying) {
            this.drawPlayerLives();
            this.drawFruit();
        } else {
            this.drawCredits();
        }
    }

    private drawPlayerLives() {
        let x: number = 0;
        const xpos = new Point(x, 0);
        for (let i = 0; i < MainWindow.gameStats.currentPlayerStats.livesRemaining; i++ , x += 16) {
            this._canvas.draw(
                xpos,
                Point.zero,
                Point.sixteen,
                PacMan.facingLeftSpritesheetPos,
                this._spriteSheet);
        }
    }

    drawCredits() {
        this._canvas.drawText(`CREDIT ${Engine.credits}`, "white", this._creditTextPoint);
    }

    drawPlayerText(playerIndex: number, text: string, pos: Point) {
        const shouldFlash = MainWindow.gameStats.currentPlayerStats.playerIndex === playerIndex;
        const shouldDraw = !shouldFlash || this._tickTock;
        if (shouldDraw) {
            this._canvas.drawText(text, "white", pos);
        }
    }

    // drawSprite max 7 fruit from max level 21
    drawFruit() {
        const highestLevel = Math.min(
            20,
            MainWindow.gameStats.currentPlayerStats.levelStats.levelNumber);

        const lowestLevel = Math.max(
            0,
            highestLevel - 6);

        let x = 204;

        // starting from the right
        for (let i = lowestLevel; i <= highestLevel; i++, x-=16) {
            const item = MainWindow.gameStats.currentPlayerStats.levelStats.getLevelProps(i).fruit;
            
            this._fruit.setFruitItem(item);
            this._fruit.position = new Point(x, 10);
            
            this._canvas.drawSprite(this._fruit);
        }
    }
}