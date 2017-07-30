import { LoopingTimer, Canvas, GameContext } from "../Core/_exports";
import { MainWindow } from "../Game/_exports";

import { TornGhostChaseAct } from "./TornGhostChaseAct";
import { GhostTearAct } from "./GhostTearAct";
import { IntroCutScene } from "../Game/IntroCutScene";
import { Engine } from "../Engine";
import { Act } from "./Act";
import { ActUpdateResult } from "./ActUpdateResult";
import { PlayerIntroAct } from "./PlayerIntroAct";
import {BigPacChaseAct} from "./BigPacChaseAct";

/**
 * When the level is finished, the screen flashes white and blue.
 * Transitions into either the cut-scene act if a 'cut-scene' is due, or the 'player intro' act.
 * * 
 */
export class LevelFinishedAct extends Act {

    private _step: number;
    private _timer: LoopingTimer;
    private _finished: boolean;

    constructor() {
        super();

        this._step = 0;

        Engine.gameSounds.reset();

        MainWindow.actors.pacMan.startDigesting();
        MainWindow.actors.ghosts.forEach(g => g.stopMoving());

        this._timer = new LoopingTimer(2000, () => {
            this._step += 1;
            MainWindow.actors.maze.startFlashing();
            MainWindow.actors.ghosts.forEach(g => g.visible = false);
            this._timer = new LoopingTimer(2000, () => {
                this._step += 1;
                MainWindow.actors.maze.stopFlashing();

                MainWindow.actors.maze.reset();
                MainWindow.gameStats.levelFinished();

                this._finished = true;
            });
        });
    }

    update(context: GameContext): ActUpdateResult {
        this._timer.run(context.elapsed);
        MainWindow.actors.maze.update(context);
        MainWindow.actors.pacMan.update(context);

        return this._finished ? ActUpdateResult.Finished : ActUpdateResult.Running;
    }

    get nextAct(): Act {
        const cutScene = MainWindow.gameStats.currentPlayerStats.levelStats.levelProps.introCutScene;
        const playerIntroAct = new PlayerIntroAct(false);
        
        if (cutScene === IntroCutScene.None) {
            return playerIntroAct;
        }
        
        if (cutScene === IntroCutScene.BigPac) {
            return new BigPacChaseAct(playerIntroAct);
        }
        
        if (cutScene === IntroCutScene.GhostSnagged) {
            return new GhostTearAct(playerIntroAct);
        }
        
        if (cutScene === IntroCutScene.TornGhostAndWorm) {
            return new TornGhostChaseAct(playerIntroAct);
        }

        throw new Error(`Don't know how to handle cut scene of ${cutScene}`);
    }

    draw(canvas: Canvas) {
        MainWindow.actors.maze.draw(canvas);
        MainWindow.actors.pacMan.draw(canvas);

        if (this._step === 0) {
            MainWindow.actors.ghosts.forEach(g => g.draw(canvas));
        }
    }
}
