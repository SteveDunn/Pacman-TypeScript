import { LoopingTimer, Canvas, GameContext } from "../Core/_exports";
import { MainWindow } from "../Game/_exports";

import { Engine } from "../Engine";
import { AttractAct } from "./AttractAct";
import { Act } from "./Act";
import { ActUpdateResult } from "./ActUpdateResult";
import { GameOverAct } from "./GameOverAct";
import { PlayerIntroAct } from "./PlayerIntroAct";
import {PlayerGameOverAct} from "./PlayerGameOverAct";
import {GameStorage} from "../GameStorage";

/**
 * An act that shows Pacman dying.  Transitions to either: the 'attract act' (if in demo mode), the 'game over act' if all players are dead,
 * or the 'attract act' for the next player that's alive.
 */
export class PacManDyingAct extends Act {

    private _step: number;
    private _timer: LoopingTimer;
    private _finished: boolean;

    constructor() {
        super();

        Engine.gameSounds.reset();

        this._step = 0;

        MainWindow.actors.pacMan.startDigesting();
        MainWindow.actors.ghosts.forEach(g => g.stopMoving());

        this._timer = new LoopingTimer(2000, () => {
            this._step += 1;
            Engine.gameSounds.pacManDying();
            
            MainWindow.actors.pacMan.startDying();
            
            this._timer = new LoopingTimer(2000, () => {
                this._step += 1;
                this._finished = true;
            });
        });
    }

    update(context: GameContext): ActUpdateResult {
        this._timer.run(context.elapsed);
        MainWindow.actors.pacMan.update(context);

        MainWindow.actors.ghosts.forEach(g => g.update(context));

        return this._finished ? ActUpdateResult.Finished : ActUpdateResult.Running;
    }

    get nextAct(): Act {
        const gameStats = MainWindow.gameStats;

        if (gameStats.isDemo) {
            return new AttractAct();
        }

        const allPlayersDead = gameStats.isGameOver;
        const currentPlayerStats = gameStats.currentPlayerStats;

        if (gameStats.highScore > GameStorage.highScore) {
            GameStorage.highScore = gameStats.highScore;
        }

        gameStats.choseNextPlayer();

        // just the current player is dead
        if (!allPlayersDead && currentPlayerStats.livesRemaining === 0) {
            return new PlayerGameOverAct(currentPlayerStats.playerIndex, new PlayerIntroAct(true));
        }

        return allPlayersDead ? new GameOverAct() : new PlayerIntroAct(true);
    }

    draw(canvas: Canvas) {
        MainWindow.actors.maze.draw(canvas);
        MainWindow.actors.pacMan.draw(canvas);

        if (this._step === 0) {
            MainWindow.actors.ghosts.forEach(g => g.draw(canvas));
        }
    }
}
