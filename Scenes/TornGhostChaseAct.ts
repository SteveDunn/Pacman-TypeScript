import { Canvas, EggTimer, GameContext, GeneralSprite, Point, Vector2D } from "../Core/_exports";
import { Direction } from "../Game/_exports";

import { Engine } from "../Engine";
import { ActUpdateResult } from "./ActUpdateResult";
import { AttractScenePacMan } from "./AttractScenePacMan";
import { Act } from "./Act";
import {StartEndPos} from "./StartEndPos";

export class TornGhostChaseAct extends Act {
    private readonly _pacMan: AttractScenePacMan;
    private readonly _worm: GeneralSprite;
    private readonly _nextAct: Act;

    private readonly _blinky: GeneralSprite;

    private readonly _pacPositions: StartEndPos;
    private readonly _pacTimer: EggTimer;

    private _ghostStartEndPos: StartEndPos;
    private _ghostTimer: EggTimer;

    private _finished: boolean;

    constructor(nextAct: Act) {
        super();

        this._finished = false;
        this._nextAct = nextAct;

        const justOffScreen = new Point(250, 140);

        this._ghostTimer = new EggTimer(4500, () => {
            this.reverseChase();
        });

        this._pacTimer = new EggTimer(4800, () => { });

        this._pacMan = new AttractScenePacMan();
        this._pacMan.direction = Direction.Left;

        this._worm = new GeneralSprite(Point.zero,
            new Vector2D(22, 11),
            new Point(11, 5.5),
            new Point(594, 132),
            new Point(626, 132),
            110);

        this._worm.visible = false;

        this._blinky = new GeneralSprite(Point.zero,
            new Vector2D(14, 14),
            new Point(7.5, 7.5),
            new Point(618, 113),
            new Point(634, 113),
            110);


        this._pacPositions = new StartEndPos(justOffScreen, new Point(-70, justOffScreen.y));
        this._pacMan.position = this._pacPositions.start;

        this._ghostStartEndPos = new StartEndPos(justOffScreen.add(new Point(50, 0)), new Point(-40, justOffScreen.y));
        this._blinky.position = this._ghostStartEndPos.start;

        Engine.gameSounds.cutScene();
    }

    get nextAct(): Act {
        return this._nextAct;
    }

    update(gameContext: GameContext): ActUpdateResult {
        this._ghostTimer.run(gameContext.elapsed);
        this._pacTimer.run(gameContext.elapsed);
        this._worm.update(gameContext);

        this.lerpBlinky();
        this.lerpPacMan();

        this._pacMan.update(gameContext);
        this._blinky.update(gameContext);
        this._worm.update(gameContext);

        return this._finished ? ActUpdateResult.Finished : ActUpdateResult.Running;
    }

    draw(canvas: Canvas): void {
        this._blinky.draw(canvas);
        this._pacMan.draw(canvas);
        this._worm.draw(canvas);
    }

    private lerpBlinky() {
        const pc = this._ghostTimer.progress / 100;
        this._blinky.position = Point.lerp(this._ghostStartEndPos.start, this._ghostStartEndPos.end, pc);
        this._worm.position = Point.lerp(this._ghostStartEndPos.start, this._ghostStartEndPos.end, pc);
    }

    private lerpPacMan() {
        const pc = this._pacTimer.progress / 100;

        this._pacMan.position = Point.lerp(this._pacPositions.start, this._pacPositions.end, pc);
    }

    private reverseChase() {
        this._ghostTimer = new EggTimer(4600, () => { this._finished = true; });

        this._pacMan.visible = false;
        this._blinky.visible = false;
        this._worm.visible = true;

        this._ghostStartEndPos = this._ghostStartEndPos.reverse();
    }
}