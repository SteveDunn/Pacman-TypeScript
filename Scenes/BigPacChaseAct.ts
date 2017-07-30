import { Canvas, EggTimer, GameContext, GeneralSprite, Point, Vector2D } from "../Core/_exports";
import { LevelStats, Direction, GhostFrightSession } from "../Game/_exports";

import { Engine } from "../Engine";
import { ActUpdateResult } from "./ActUpdateResult";
import { DirectionInfo, GhostNickname } from "../Ghosts/_exports";
import { AttractScenePacMan } from "./AttractScenePacMan";
import { Act } from "./Act";
import { AttractGhost } from "./AttractGhost";
import {StartEndPos} from "./StartEndPos";

export class BigPacChaseAct extends Act {
    private readonly _pacMan: AttractScenePacMan;
    private readonly _bigPacMan: GeneralSprite;
    private readonly _nextAct: Act;

    private readonly _blinky: AttractGhost;

    private _pacPositions: StartEndPos;
    private _pacTimer: EggTimer;

    private _blinkyPositions: StartEndPos;
    private _blinkyTimer: EggTimer;

    private _finished: boolean;

    constructor(nextAct: Act) {
        super();
        
        this._finished = false;
        this._nextAct = nextAct;

        const justOffScreen = new Point(250, 140);

        this._blinkyTimer = new EggTimer(4500, () => {
            this.reverseChase();
        });

        this._pacTimer = new EggTimer(4750, () => { });

        this._pacMan = new AttractScenePacMan();
        this._pacMan.direction = Direction.Left;

        this._bigPacMan = new GeneralSprite(Point.zero,
            new Vector2D(31, 32),
            new Point(16, 16),
            new Point(488, 16),
            new Point(520, 16),
            110);

        this._bigPacMan.visible = false;

        this._blinky = new AttractGhost(GhostNickname.Blinky, Direction.Left);

        this._pacPositions = new StartEndPos(justOffScreen, new Point(-70, justOffScreen.y));
        this._pacMan.position = this._pacPositions.start;

        this._blinkyPositions = new StartEndPos(justOffScreen.add(new Point(20,0)), new Point(-40, justOffScreen.y));
        this._blinky.position = this._blinkyPositions.start;

        Engine.gameSounds.cutScene();
    }

    get nextAct(): Act {
        return this._nextAct;
    }

    update(gameContext: GameContext): ActUpdateResult {
        this._blinkyTimer.run(gameContext.elapsed);
        this._pacTimer.run(gameContext.elapsed);
        this._bigPacMan.update(gameContext);

        this.lerpBlinky();
        this.lerpPacMan();

        this._pacMan.update(gameContext);
        this._blinky.update(gameContext);
        this._bigPacMan.update(gameContext);

        return this._finished ? ActUpdateResult.Finished : ActUpdateResult.Running;
    }

    draw(canvas: Canvas): void {
        this._blinky.draw(canvas);
        this._pacMan.draw(canvas);
        this._bigPacMan.draw(canvas);
    }

    private lerpBlinky() {
        const pc = this._blinkyTimer.progress / 100;
        this._blinky.position = Point.lerp(this._blinkyPositions.start, this._blinkyPositions.end, pc);
    }

    private lerpPacMan() {
        const pc = this._pacTimer.progress / 100;

        this._pacMan.position = Point.lerp(this._pacPositions.start, this._pacPositions.end, pc);
        this._bigPacMan.position = Point.lerp(this._pacPositions.start, this._pacPositions.end, pc);
    }

    private reverseChase() {
        this._blinkyTimer = new EggTimer(4600, () => { });
        this._pacTimer = new EggTimer(4350, () => { this._finished = true; });

        this._pacMan.visible = false;
        this._bigPacMan.visible = true;

        const s = new LevelStats(0);
        const sess = new GhostFrightSession(s.levelProps);

        this._blinky.direction = new DirectionInfo(Direction.Right, Direction.Right);
        this._blinky.frightSession = sess;
        this._blinky.setFrightened();
        this._blinkyPositions = this._blinkyPositions.reverse();

        let bigPacPos = this._pacPositions.reverse();
        bigPacPos = new StartEndPos(bigPacPos.start.minus(new Point(100, 0)), bigPacPos.end);
        
        this._pacPositions = bigPacPos;
    }
}