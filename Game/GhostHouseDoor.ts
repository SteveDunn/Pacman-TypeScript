import { GameContext } from "../Core/_exports";
import { Ghost, GhostNickname } from "../Ghosts/_exports";

import { GlobalDotCounter, DotCounter } from "./DotCounter";
import { MainWindow } from "./MainWindow";

interface GhostCounters {
    [nickname: string]: DotCounter;
}


export class GhostHouseDoor {
    private _activeCounter: DotCounter;
    private _pillConsumptionTimeIdle: number = 0;

    readonly _ghostCounters: GhostCounters;
    readonly _ghostCounterEnum: DotCounter[];
    readonly _globalCounter: GlobalDotCounter;
    readonly _nullCounter: DotCounter;

    constructor(level: number) {
        this._ghostCounters = {};

        this._nullCounter = new DotCounter(Number.MAX_VALUE);

        this._globalCounter = new GlobalDotCounter(0);
        this._globalCounter.isActive = false;

        const pinkyCounter = new DotCounter(0);

        if (level === 0) {
            this._ghostCounters[GhostNickname.Pinky] = pinkyCounter;
            this._ghostCounters[GhostNickname.Inky] = new DotCounter(30);
            this._ghostCounters[GhostNickname.Clyde] = new DotCounter(60);
        }

        if (level === 1) {
            this._ghostCounters[GhostNickname.Pinky] = pinkyCounter;
            this._ghostCounters[GhostNickname.Inky] = new DotCounter(0);
            this._ghostCounters[GhostNickname.Clyde] = new DotCounter(50);
        }

        if (level >= 2) {
            this._ghostCounters[GhostNickname.Pinky] = pinkyCounter;
            this._ghostCounters[GhostNickname.Inky] = new DotCounter(0);
            this._ghostCounters[GhostNickname.Clyde] = new DotCounter(0);
        }

        this._ghostCounterEnum = [
            this._ghostCounters[GhostNickname.Pinky],
            this._ghostCounters[GhostNickname.Inky],
            this._ghostCounters[GhostNickname.Clyde]
        ];

        this._pillConsumptionTimeIdle = 0;

        this._activeCounter = pinkyCounter;
        this._activeCounter.isActive = true;

        this.switchToUseCounterOfNextGhost();
    }

    update(context: GameContext) {
        this._pillConsumptionTimeIdle += context.elapsed;

        if (this._pillConsumptionTimeIdle > 4000) {
            this.whenNoPillsEaten();
        }
    }

    whenNoPillsEaten() {
        this._pillConsumptionTimeIdle = 0;
        this._activeCounter.setTimedOut();

        this.switchToUseCounterOfNextGhost();
    }

    ghostLeftHouse(ghost: GhostNickname) {
        if (this._activeCounter !== this._ghostCounters[ghost]) {
            throw new Error(`${ghost.toString()} cannot leave the house as he's not the current counter!`);
        }
    }

    switchToUseCounterOfNextGhost() {
        if (this._activeCounter === this._globalCounter) {
            if(this._activeCounter.isFinished) {
                this.switchActive(this._nullCounter);
            }
            return;
        }

        if (this._activeCounter === this._nullCounter) {
            console.info("!!! SWITCHED TO NULL COUNTER !!!");
            return;
        }

        if (this._activeCounter === this._ghostCounters[GhostNickname.Pinky]) {
            this.switchActive(this._ghostCounters[GhostNickname.Inky]);
        } else if (this._activeCounter === this._ghostCounters[GhostNickname.Inky]) {
            this.switchActive(this._ghostCounters[GhostNickname.Clyde]);
        } else if (this._activeCounter === this._ghostCounters[GhostNickname.Clyde]) {
            this.switchActive(this._nullCounter);
        } else {
            throw new Error("don't know where to switch the active dot counter to!");
        }
    }

    canGhostLeave(ghost: Ghost) {
        if (ghost.nickName === GhostNickname.Blinky) {
            return true;
        }

        if (this._globalCounter.isActive) {
            return this._globalCounter.canGhostLeave(ghost.nickName);
        }

        if(this._activeCounter === this._nullCounter) {
            return true;
        }

        return this._ghostCounters[ghost.nickName].limitReached;
    }

    switchToUseGlobalCounter() {
        this._globalCounter.reset();
        this.switchActive(this._globalCounter);
    }

    switchActive(counter: DotCounter) {
        this._activeCounter.isActive = false;
        this._activeCounter = counter;
        this._activeCounter.isActive = true;
    }

    pillEaten() {
        this._pillConsumptionTimeIdle = 0;

        if (this._activeCounter === this._globalCounter) {
            if (this._globalCounter.counter === 32
                && MainWindow.actors.getGhost(GhostNickname.Clyde).isInHouse) {
            }
        }

        this._activeCounter.increment();
        if (this._activeCounter.limitReached) {
            this.switchToUseCounterOfNextGhost();
        }
    }
}
