import { GameContext, Point } from "../Core/_exports";

import { Engine } from "../Engine";
import { GhostMovementConductor } from "../Ghosts/GhostMovementConductor";
import { GhostFrightSession } from "./GhostFrightSession";
import { GhostNickname } from "../Ghosts/GhostNickname";
import { LevelStats } from "./LevelStats";
import { GhostHouseDoor } from "./GhostHouseDoor";

export class PlayerStats {
    protected _livesRemaining: number;

    private _ghostHouseDoor: GhostHouseDoor;
    private _levelStats: LevelStats;
    private _score: number;
    private _playerIndex: number;
    private _extraLives: number[];
    private _levelNumber: number;
    private _ghostFrightSession: GhostFrightSession;

    private _ghostMovementConductor: GhostMovementConductor;

    constructor(playerIndex: number) {
        this._playerIndex = playerIndex;
        this._score = 0;
        //cheat
        this._livesRemaining = 3;
        this._levelNumber = -1;

        this._extraLives = [];
        this._extraLives.push(10000);

        this.newLevel();
    }

    update(context: GameContext) {
        if (this._ghostFrightSession !== undefined && !this._ghostFrightSession.isFinished) {
            this._ghostFrightSession.update(context);
        } else {
            this._ghostMovementConductor.update(context);
        }

        this._ghostHouseDoor.update(context);
    }

    get ghostMoveConductor(): GhostMovementConductor {
        return this._ghostMovementConductor;
    }

    ghostLeftHouse(ghost: GhostNickname) {
        this._ghostHouseDoor.ghostLeftHouse(ghost);
    }

    get ghostHouseDoor(): GhostHouseDoor {
        return this._ghostHouseDoor;
    }

    newLevel() {
        this._levelStats = new LevelStats(++this._levelNumber);
        this._ghostHouseDoor = new GhostHouseDoor(0);

        const props = this.levelStats.getGhostPatternProperties();

        this._ghostMovementConductor = new GhostMovementConductor(props);
    }

    get playerIndex(): number {
        return this._playerIndex;
    }

    get levelStats(): LevelStats {
        return this._levelStats;
    }

    get livesRemaining(): number {
        return this._livesRemaining;
    }

    protected increaseScoreBy(amount: number) {
        this._score += amount;
        if (this._extraLives.length === 0) {
            return;
        }

        if (this._score > this._extraLives[0]) {
            Engine.gameSounds.gotExtraLife();
            this._livesRemaining += 1;
            this._extraLives.splice(0, 1);
        }
    }

    pillEaten(point: Point) {
        this._ghostHouseDoor.pillEaten();
        this.increaseScoreBy(10);
        this._levelStats.pillEaten(point);
    }

    fruitEaten() {
        this.increaseScoreBy(this._levelStats.levelProps.fruitPoints);
        this.levelStats.fruitSession.fruitEaten();
    }

    get frightSession(): GhostFrightSession {
        return this._ghostFrightSession;
    }

    get isInFrightSession(): boolean {
        return this.frightSession !== undefined && !this.frightSession.isFinished;
    }

    powerPillEaten(point: Point) {
        this._ghostFrightSession = new GhostFrightSession(this._levelStats.levelProps);

        this._ghostHouseDoor.pillEaten();
        this.increaseScoreBy(50);
        this._levelStats.pillEaten(point);
    }

    pacManEaten() {
        this._ghostHouseDoor.switchToUseGlobalCounter();

        const props = this.levelStats.getGhostPatternProperties();

        this._ghostMovementConductor = new GhostMovementConductor(props);
    }

    decreaseLives() {
        this._livesRemaining -= 1;
    }

    ghostEaten(): number {
        const points = this._ghostFrightSession.ghostEaten();

        this.increaseScoreBy(points);

        return points;
    }

    get score(): number {
        return this._score;
    }
}