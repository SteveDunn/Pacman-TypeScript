import { LevelStats, GhostFrightSession, TimedSprite, TimedSpriteList, Pill, PowerPill, ScoreSprite, Direction } from "../Game/_exports";
import { EggTimer, Canvas, GameContext, Point } from "../Core/_exports";
import { GhostNickname } from "../Ghosts/_exports";

import { ActUpdateResult } from "./ActUpdateResult";
import { AttractScenePacMan } from "./AttractScenePacMan";
import { AttractGhost } from "./AttractGhost";
import {StartEndPos} from "./StartEndPos";

class TimerList {
    private _timers: EggTimer[];
    constructor() {
        this._timers = [];
    }

    add(timer: EggTimer) {
        this._timers.push(timer);
    }

    update(context: GameContext) {
        this._timers.forEach(s => s.run(context.elapsed));

        for (let i = this._timers.length - 1; i >= 0; i--) {
            if (this._timers[i].finished) {
                this._timers.splice(i, 1);
                break;
            }
        }
    }
}

interface IGhostPositions {
    [nickname: string]: StartEndPos;
}

export class ChaseSubAct {
    private readonly _tempTimers: TimerList;

    private readonly _ghosts: AttractGhost[];

    private readonly _pacMan: AttractScenePacMan;

    private readonly _powerPillToEat: PowerPill;
    private readonly _powerPillLegend: PowerPill;
    private readonly _pillLegend: Pill;

    private readonly _blinky: AttractGhost;
    private readonly _pinky: AttractGhost;
    private readonly _inky: AttractGhost;
    private readonly _clyde: AttractGhost;

    private _legendVisible: boolean = false;
    private _copyrightVisible: boolean = false;
    private _ghostsChasing: boolean = false;

    private _ready: boolean;
    private _ghostScore: number;
    private _pacPositions: StartEndPos;

    private _ghostPositions: IGhostPositions;

    private _ghostTimer: EggTimer;
    private _pacTimer: EggTimer;

    private _ghostEatenTimer: EggTimer;

    private _timers: EggTimer[];
    private _tempSprites: TimedSpriteList;

    private _finished: boolean;

    constructor() {
        this._finished = false;
        this._tempTimers = new TimerList();

        this._ready = false;
        this._ghostScore = 200;

        this._tempSprites = new TimedSpriteList();
        this._ghosts = [];

        this._timers = [];

        let justOffScreen = new Point(250, 140);

        this._ghostEatenTimer = new EggTimer(0, () => { });
        this._ghostTimer = new EggTimer(5000, () => { this.reverseChase(); });
        this._pacTimer = new EggTimer(5100, () => { });
        this._powerPillToEat = new PowerPill();
        this._powerPillToEat.visible = false;

        this._powerPillToEat.position = new Point(30, justOffScreen.y + 4);

        this._pillLegend = new Pill();
        this._pillLegend.position = new Point(70, 178);

        this._powerPillLegend = new PowerPill();
        this._powerPillLegend.position = new Point(70, 188);

        this._pacMan = new AttractScenePacMan();
        this._pacMan.direction = Direction.Left;

        this._blinky = new AttractGhost(GhostNickname.Blinky, Direction.Left);
        this._pinky = new AttractGhost(GhostNickname.Pinky, Direction.Left);
        this._inky = new AttractGhost(GhostNickname.Inky, Direction.Left);
        this._clyde = new AttractGhost(GhostNickname.Clyde, Direction.Left);

        this._ghosts.push(this._blinky);
        this._ghosts.push(this._pinky);
        this._ghosts.push(this._inky);
        this._ghosts.push(this._clyde);

        let gap = new Point(16, 0);

        this._pacPositions = new StartEndPos(justOffScreen, new Point(30, justOffScreen.y));
        this._pacMan.position = this._pacPositions.start;

        this._ghostPositions = {};

        let startPos = justOffScreen.add(new Point(50, 0));
        let endPos = new Point(50, justOffScreen.y);

        this._blinky.position = startPos;
        this._ghostPositions[this._blinky.nickName] = new StartEndPos(startPos, endPos);

        startPos = startPos.add(gap);
        endPos = endPos.add(gap);
        this._pinky.position = startPos;
        this._ghostPositions[this._pinky.nickName] = new StartEndPos(startPos, endPos);

        startPos = startPos.add(gap);
        endPos = endPos.add(gap);
        this._inky.position = startPos;
        this._ghostPositions[this._inky.nickName] = new StartEndPos(startPos, endPos);

        startPos = startPos.add(gap);
        endPos = endPos.add(gap);
        this._clyde.position = startPos;
        this._ghostPositions[this._clyde.nickName] = new StartEndPos(startPos, endPos);

        this._tempTimers.add(new EggTimer(1000, () => this._legendVisible = true));
        this._tempTimers.add(new EggTimer(3000, () => {
            this._powerPillToEat.visible = true;
            this._copyrightVisible = true;
        }));

        this._tempTimers.add(new EggTimer(4500, () => {
            this._ghostsChasing = true;
        }));
    }

    go() {
        this._ready = true;
    }

    update(gameContext: GameContext): ActUpdateResult {
        if (this._finished) {
            return ActUpdateResult.Finished;
        }
        this._tempTimers.update(gameContext);
        if (this._ghostsChasing) {
            this._powerPillLegend.update(gameContext);
            this._powerPillToEat.update(gameContext);
            this._ghostTimer.run(gameContext.elapsed);
            this._pacTimer.run(gameContext.elapsed);
            this._ghostEatenTimer.run(gameContext.elapsed);
        }

        this._pillLegend.update(gameContext);


        this._tempSprites.update(gameContext);
        this.lerpPacMan();

        this._ghosts.forEach(g => {

            if (!g.alive) {
                return;
            }
            this.lerpGhost(g);

            g.update(gameContext);

            if (Point.areNear(this._pacMan.position, g.position, 2)) {
                this.ghostEaten(g);
                if (g.nickName === GhostNickname.Clyde) {

                    this._tempTimers.add(new EggTimer(1000, () => {
                        this._finished = true;
                    }));
                }
            };
        });

        this._pacMan.update(gameContext);

        return ActUpdateResult.Running;
    }

    draw(canvas: Canvas): void {
        this._powerPillToEat.draw(canvas);

        if (this._legendVisible) {
            this._powerPillLegend.draw(canvas);
            this._pillLegend.draw(canvas);
            canvas.drawText("10 pts", "white", new Point(80, 170));
            canvas.drawText("50 pts", "white", new Point(80, 180));
        }

        if (this._copyrightVisible) {
            canvas.drawText("© 1980 midway mfg. co.", "white", new Point(10, 220));
        }

        if (this._ready) {
        }

        this._tempSprites.draw(canvas);

        this._ghosts.forEach(g => {
            if (g.alive) {
                g.draw(canvas);
            }
        });

        this._pacMan.draw(canvas);
    }

    ghostEaten(ghost: AttractGhost) {
        ghost.alive = false;

        this._pacMan.visible = false;

        this._ghostTimer.pause();
        this._pacTimer.pause();

        this.showScore(ghost.position, this._ghostScore);
        this._ghostScore *= 2;

        this._ghostEatenTimer = new EggTimer(1000, () => {
            this._ghostTimer.resume();
            this._pacTimer.resume();
            this._pacMan.visible = true;
        });

    }

    showScore(pos: Point, amount: number) {
        this._tempSprites.add(new TimedSprite(900, new ScoreSprite(pos, amount)));
    }

    lerpGhost(ghost: AttractGhost) {
        const pc = this._ghostTimer.progress / 100;
        const positions = this._ghostPositions[ghost.nickName];
        ghost.position = Point.lerp(positions.start, positions.end, pc);
    }

    lerpPacMan() {
        const pc = this._pacTimer.progress / 100;

        this._pacMan.position = Point.lerp(this._pacPositions.start, this._pacPositions.end, pc);
    }

    reverseChase() {
        this._powerPillToEat.visible = false;
        this._ghostTimer = new EggTimer(12000, () => { });
        this._pacTimer = new EggTimer(6000, () => { });

        const s = new LevelStats(0);
        const sess = new GhostFrightSession(s.levelProps);

        this._ghosts.forEach(g => {
            g.direction.update(Direction.Right);
            g.frightSession = sess;
            g.setFrightened();
            this._ghostPositions[g.nickName] = this._ghostPositions[g.nickName].reverse();
        });

        this._pacPositions = this._pacPositions.reverse();

        this._pacMan.direction = Direction.Right;
    }
}
