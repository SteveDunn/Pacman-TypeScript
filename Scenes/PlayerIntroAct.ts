import { LoopingTimer, Canvas, GameContext } from "../Core/_exports";
import { MainWindow } from "../Game/_exports";

import { GameAct } from "./GameAct";
import { DemoAct } from "./DemoAct";
import { Act } from "./Act";
import { ActUpdateResult } from "./ActUpdateResult";
import { Engine } from "../Engine";
import { TextPoints } from "./TextPoints";

/**
 * Introduces the current player, shows player X and ready for 3 seconds, then ghosts and ready for 3 seconds.
 * Transitions to either the 'demo act' (if in demo mode), otherwise the 'game act'
 */
export class PlayerIntroAct extends Act {

    private _progress: number = 0;
    private _finished: boolean;

    private _currentTimer: LoopingTimer;

    constructor(private readonly _shouldDecreasePacLives: boolean, private readonly _isDemoMode = false) {
        super();

        MainWindow.actors.fruit.reset();
        MainWindow.actors.pacMan.reset(this._isDemoMode);

        MainWindow.actors.ghosts.forEach(g => g.reset());

        this._progress = 0;

        const timeToShowPlayerNumberAndHideGhosts: number = _isDemoMode ? 0 : 2000;

        if (!MainWindow.gameStats.hasPlayedIntroTune) {
            MainWindow.gameStats.playerIntroTune();
            Engine.gameSounds.playerStart();
        } 

        this._currentTimer = new LoopingTimer(timeToShowPlayerNumberAndHideGhosts, () => {
            this._progress += 1;
            if (this._shouldDecreasePacLives) {
                MainWindow.gameStats.currentPlayerStats.decreaseLives();
            }
            this._currentTimer = new LoopingTimer(2000, () => {

                this._finished = true;
            });
        });
    }

    update(context: GameContext): ActUpdateResult {
        this._currentTimer.run(context.elapsed);

        return this._finished ? ActUpdateResult.Finished : ActUpdateResult.Running;
    }

    draw(canvas: Canvas) {
        MainWindow.actors.maze.draw(canvas);

        if (this._isDemoMode) {
            canvas.drawText("GAME OVER", "red", TextPoints.gameOverPoint);
        } else {
            this.drawPlayerAndReadyText(canvas);
        }

        if (this._progress === 1) {
            MainWindow.actors.pacMan.draw(canvas);

            MainWindow.actors.ghosts.forEach(g => g.draw(canvas));
        }
    }

    drawPlayerAndReadyText(canvas: Canvas) {
        let text: string;

        if (this._progress === 0) {
            if (MainWindow.gameStats.currentPlayerStats.playerIndex === 0) {
                text = "PLAYER ONE";
            } else {
                text = "PLAYER TWO";
            }

            canvas.drawText(text, "cyan", TextPoints.playerTextPoint);
        }

        canvas.drawText("READY!", "yellow", TextPoints.readyPoint);
    }

    get nextAct(): Act {
        return this._isDemoMode ? new DemoAct() : new GameAct();
    }
}

