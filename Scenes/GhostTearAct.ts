import { Direction } from "../Game/_exports";
import { GhostNickname } from "../Ghosts/_exports";

import {
    Canvas,
    EggTimer,
    GameContext,
    GeneralSprite,
    LoopingTimer,
    NullSprite,
    Point,
    Vector2D
    } from "../Core/_exports";

import { Engine } from "../Engine";

import { ActUpdateResult } from "./ActUpdateResult";
import { AttractScenePacMan } from "./AttractScenePacMan";
import { Act } from "./Act";
import { AttractGhost } from "./AttractGhost";
import {StartEndPos} from "./StartEndPos";

enum Stage {
    MovingBlinky,
    TearingBlinky,
    BlinkyLooking
}

export class GhostTearAct extends Act {

    private _snagSprite: GeneralSprite;
    private _stage: Stage;
    private _finished: boolean;
    private _animFrame: number;

    private readonly _pacMan: AttractScenePacMan;
    private readonly _nextAct: Act;

    private readonly _blinky: AttractGhost;
    private _lookingBlinky: GeneralSprite;

    private readonly _pacPositions: StartEndPos;
    private _pacTimer: EggTimer;
    private _tearTimer: LoopingTimer;
    private _lookTimer: LoopingTimer;

    private _blinkyPositions: StartEndPos;
    private _blinkyTimer: EggTimer;

    private readonly _centerPoint = new Point(120, 140);

    private readonly _tearFrames: Point[];
    private readonly _blinkyLookFrames: Point[];

    private readonly _tearSize = new Vector2D(13, 13);
    private readonly _tearOffset = new Point(7, 6.5);

    constructor(nextAct: Act) {
        super();

        this._finished = false;
        this._nextAct = nextAct;
        this._stage = Stage.MovingBlinky;
        this._animFrame = 0;

        this._tearFrames = [
            new Point(589, 98),
            new Point(609, 98),
            new Point(622, 98),
            new Point(636, 98),
            new Point(636, 98),
            new Point(636, 98),
            new Point(649, 98)
        ];

        this._blinkyLookFrames = [
            new Point(584, 113),
            new Point(600, 113)
        ];

        this._blinkyTimer = new EggTimer(4500, () => {
            this.blinkyCaught();
        });

        this._tearTimer = new LoopingTimer(500,
            () => {
                if (this._stage === Stage.TearingBlinky) {
                    this.updateTearAnimation();
                }
            });

        this._lookTimer = new LoopingTimer(Number.MAX_VALUE, () => { });

        this._pacTimer = new EggTimer(4750, () => { });

        this._pacMan = new AttractScenePacMan();
        this._pacMan.direction = Direction.Left;

        this._snagSprite = new GeneralSprite(this._centerPoint, this._tearSize, this._tearOffset, this._tearFrames[0]);

        this._snagSprite.visible = true;

        this._blinky = new AttractGhost(GhostNickname.Blinky, Direction.Left);
        this._lookingBlinky = new NullSprite();

        const justOffScreen = new Point(250, 140);

        this._pacPositions = new StartEndPos(justOffScreen, new Point(-70, justOffScreen.y));
        this._pacMan.position = this._pacPositions.start;

        this._blinkyPositions = new StartEndPos(justOffScreen.add(new Point(120, 0)), this._centerPoint.minus(new Point(10, 0)));
        this._blinky.position = this._blinkyPositions.start;
        Engine.gameSounds.cutScene();

    }

    get nextAct(): Act {
        return this._nextAct;
    }

    update(gameContext: GameContext): ActUpdateResult {
        this._blinkyTimer.run(gameContext.elapsed);
        this._pacTimer.run(gameContext.elapsed);
        this._tearTimer.run(gameContext.elapsed);
        this._lookTimer.run(gameContext.elapsed);

        if (this._stage === Stage.MovingBlinky) {
            this.lerpBlinky();
        }

        this.lerpPacMan();

        this._pacMan.update(gameContext);
        this._blinky.update(gameContext);
        this._lookingBlinky.update(gameContext);
        this._snagSprite.update(gameContext);

        return this._finished ? ActUpdateResult.Finished : ActUpdateResult.Running;
    }

    draw(canvas: Canvas): void {
        //canvas.drawRect(this.snagSprite, "white");
        //canvas.drawRect(this.blinky, "green");

        this._pacMan.draw(canvas);
        this._blinky.draw(canvas);
        this._lookingBlinky.draw(canvas);
        this._snagSprite.draw(canvas);

    }

    private lerpBlinky() {
        const pc = this._blinkyTimer.progress / 100;
        this._blinky.position = Point.lerp(this._blinkyPositions.start, this._blinkyPositions.end, pc);
    }

    private lerpPacMan() {
        const pc = this._pacTimer.progress / 100;

        this._pacMan.position = Point.lerp(this._pacPositions.start, this._pacPositions.end, pc);
    }

    private blinkyCaught() {
        this._stage = Stage.TearingBlinky;
    }

    updateTearAnimation() {
        ++this._animFrame;
        if (this._animFrame < this._tearFrames.length) {
            this._snagSprite = new GeneralSprite(this._centerPoint, this._tearSize, this._tearOffset, this._tearFrames[this._animFrame]);
            //this.snagSprite.position = this.snagSprite.position.minus(new Point(1, 0));
            this._blinky.position = this._blinky.position.minus(new Point(1, 0));
            return;
        }

        this._animFrame = 0;
        this._blinky.visible = false;
        this.setLookingBlinky(0);

        this._lookTimer = new LoopingTimer(1500, () => {
            this.updateBlinkyLookAnimation();
        });

        this._lookingBlinky.visible = true;
        this._stage = Stage.BlinkyLooking;
    }

    setLookingBlinky(frame: number) {
        this._lookingBlinky = new GeneralSprite(this._blinky.position, this._blinky.size, this._blinky.origin, this._blinkyLookFrames[frame]);
        this._lookingBlinky.visible = true;
    }

    updateBlinkyLookAnimation() {
        ++this._animFrame;
        this.setLookingBlinky(this._animFrame);

        if (this._animFrame === 2) {
            this._animFrame = 0;
            this._finished = true;
        }
    }
}