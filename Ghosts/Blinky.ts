import { Canvas, Point } from "../Core/_exports";
import { MainWindow, Diags, Direction, Maze } from "../Game/_exports";

import { GhostState } from "./GhostMode";
import { GhostNickname } from "./GhostNickname";
import { Ghost } from "./Ghost";
import {GhostMovementMode} from "./GhostMovementMode";

export class Blinky extends Ghost {
    private readonly _scatterTarget = new Point(25, 0);

    constructor(public readonly maze: Maze) {

        super("Blinky", GhostNickname.Blinky, maze, new Point(13.5, 11), Direction.Left);

        this.getScatterTarget = ()=> this._scatterTarget;
        this.getChaseTarget = this._getChaseTargetCell;

        this.houseOffset = 0;
    }

    reset(): void {
        super.reset();
        this._state = GhostState.Normal;
        this._movementMode = GhostMovementMode.Undecided;
    }

    // Whenever Clyde needs to determine his target tile, he first calculates his distance from Pac-Man. 
    // If he is farther than eight tiles away, his targeting is identical to Blinky’s, 
    // using Pac-Man’s current tile as his target. However, as soon as his distance
    // to Pac-Man becomes less than eight tiles, Clyde’s target is set to the same tile as his fixed 
    // one in Scatter mode, just outside the bottom-left corner of the maze
    // Pac-Man’s current position and orientation, and selecting the location four tiles straight 
    // ahead of him. Works when PacMan is facing left, down, or right, but when facing upwards, 
    // it's also four tiles to the left 
    private _getChaseTargetCell = () => {
        var pacCellPos = MainWindow.actors.pacMan.getTile().index;

        return pacCellPos;
    }

    // we are reading these properties:
    // elroy1DotsLeft
    // elroy1SpeedPc 
    // elroy2DotsLeft
    // elroy2SpeedPc 

    getNormalGhostSpeedPercent(): number {
        const levelProps = MainWindow.gameStats.currentPlayerStats.levelStats.levelProps;
        const pillsRemaining = MainWindow.gameStats.currentPlayerStats.levelStats.pillsRemaining;

        if (pillsRemaining > levelProps.elroy1DotsLeft) {
            return levelProps.ghostSpeedPc;
        }
        
        if (pillsRemaining < levelProps.elroy2DotsLeft) {
            return levelProps.elroy2SpeedPc;
        }

        return levelProps.elroy1SpeedPc;
    }

    draw(canvas: Canvas): void {
        super.draw(canvas);

        if (Diags.enabled) {
            this.maze.highlightCell(canvas, this._getChaseTargetCell(), "red");
        }
    };
}

