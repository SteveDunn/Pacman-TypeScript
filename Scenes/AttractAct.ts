import { MainWindow, PowerPill, Direction } from "../Game/_exports";
import { SimpleGhost, GhostNickname } from "../Ghosts/_exports";
import { Canvas, GameContext, Keyboard, Point, Vector2D } from "../Core/_exports";

import { PlayerIntroAct } from "./PlayerIntroAct";
import { StartButtonAct } from "./StartButtonAct";
import { Engine } from "../Engine";
import { ChaseSubAct } from "./ChaseSubAct";
import { ActUpdateResult } from "./ActUpdateResult";
import { AttractScenePacMan } from "./AttractScenePacMan";
import { Act } from "./Act";

/**
 * The 'attact scene' act.  Show's the attract screen.  Transitions to either
 * the 'player intro' act (to start the demo mode if nothings was pressed/clicked/touched),
 * or the 'start button' act if a coin was 'inserted'.
 */
export class AttractAct extends Act {

    private readonly _powerDotLegend: PowerPill;
    private readonly _chaseSubAct: ChaseSubAct;
    private readonly _pacMan: AttractScenePacMan;
    private readonly _blinky: SimpleGhost;
    private readonly _pinky: SimpleGhost;
    private readonly _inky: SimpleGhost;
    private readonly _clyde: SimpleGhost;
    private readonly _gameContext: GameContext;
    private readonly _offScreenCanvas: Canvas;

    private readonly _pos = new Point(45, 65);

    private _nextAct: Act;
    private _chaseSubActReady: boolean;

    constructor() {
        super();

        this._pos = new Point(45, 65);

        this._gameContext = new GameContext();
        this._pacMan = new AttractScenePacMan();

        this._powerDotLegend = new PowerPill();
        this._powerDotLegend.position = new Point(150, 250);
        this._powerDotLegend.visible = false;

        this._blinky = new SimpleGhost(GhostNickname.Blinky, Direction.Right);
        this._pinky = new SimpleGhost(GhostNickname.Pinky, Direction.Right);
        this._inky = new SimpleGhost(GhostNickname.Inky, Direction.Right);
        this._clyde = new SimpleGhost(GhostNickname.Clyde, Direction.Right);

        this._offScreenCanvas = Canvas.createOffscreenCanvas(new Vector2D(600, 400));
        this._offScreenCanvas.fillRect("black", Point.zero, this._offScreenCanvas.size);

        this._chaseSubAct = new ChaseSubAct();

        setTimeout(() => this.writeTextSlowly(), 500);

        Engine.showControlPanel();
    }

    get nextAct(): Act {
        if (this._nextAct === undefined) {
            throw new Error("no next act defined!");
        }

        return this._nextAct;
    }

    writeTextSlowly() {
        this._offScreenCanvas.drawText("CHARACTER / NICKNAME", "white", new Point(32, 12));
        const gap = new Point(0, 24);

        let pos = new Point(16, 30);

        const timeForEachOne = 2100;

        this.drawGhostDescriptor(this._offScreenCanvas, this._blinky, "red", "SHADOW", "BLINKY", pos);

        setTimeout(() => {
           pos = pos.add(gap);
           this.drawGhostDescriptor(this._offScreenCanvas, this._pinky, "pink", "SPEEDY", "PINKY", pos);
        }, timeForEachOne);

        setTimeout(() => {
           pos = pos.add(gap);
           this.drawGhostDescriptor(this._offScreenCanvas, this._inky, "cyan", "BASHFUL", "INKY", pos);
        }, timeForEachOne * 2);

        setTimeout(() => {
           pos = pos.add(gap);
           this.drawGhostDescriptor(this._offScreenCanvas, this._clyde, "yellow", "POKEY", "CLYDE", pos);
        }, timeForEachOne * 3);

        setTimeout(() => {
           this._chaseSubActReady = true;
        }, timeForEachOne * 4);
    }

    drawGhostDescriptor = (canvas: Canvas, ghost: SimpleGhost, color: string, name: string, nickname: string, pos: Point) => {
        ghost.position = pos;

        canvas.drawSprite(ghost);

        pos = pos.add(new Point(18, -4));

        setTimeout(() => {
            canvas.drawText(`-${name}`, color, pos);
            pos = pos.add(new Point(90, 0));
        }, 1000);

        setTimeout(() => {
            canvas.drawText(`"${nickname}"`, color, pos);
        }, 1500);
    }

    private startDemoGame() {
        MainWindow.newDemoGame();

        Engine.gameSounds.muteAll();
        this._nextAct = new PlayerIntroAct(false, true);
    }

    update(gameContext: GameContext): ActUpdateResult {
        if (GameContext.keyboard.wasKeyPressed(Keyboard.left)) {
            this.startDemoGame();
            return ActUpdateResult.Finished;
        }

        if (GameContext.keyboard.wasKeyPressed(Keyboard.enter)) {
            Engine.gameSounds.unmuteAll();
            return ActUpdateResult.Finished;
        }

        if (GameContext.keyboard.wasKeyPressed(Keyboard.five)) {
            Engine.gameSounds.unmuteAll();
            Engine.coinInserted();
            this._nextAct = new StartButtonAct();
            return ActUpdateResult.Finished;
        }

        if (this._chaseSubActReady) {
            if(this._chaseSubAct.update(gameContext) === ActUpdateResult.Finished) {
                this.startDemoGame();
                return ActUpdateResult.Finished;
            }
        }
        return ActUpdateResult.Running;
    }

    draw(canvas: Canvas) {
        
        canvas.drawOtherCanvas(this._offScreenCanvas, this._pos);
        
        if (this._chaseSubActReady) {
            this._chaseSubAct.draw(canvas);
        }
    }
}
