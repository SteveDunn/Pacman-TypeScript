import { Canvas, Vector2D, Point } from "../Core/_exports";
import { MainWindow, Diags, Direction, Maze } from "../Game/_exports";

import { GhostInsideHouseMover } from "./GhostInsideHouseMover";
import { GhostState } from "./GhostMode";
import { GhostNickname } from "./GhostNickname";
import { Ghost } from "./Ghost";
import { DirectionInfo } from "./DirectionInfo";
import {GhostMovementMode} from "./GhostMovementMode";

export class Clyde extends Ghost {
    private readonly _scatterTarget = new Point(0, 29);

    constructor(public readonly maze: Maze) {

        super("Clyde", GhostNickname.Clyde, maze, new Point(11.5, 12), Direction.Up);

        this.getChaseTarget = this._getChaseTargetCell;
        this.getScatterTarget = ()=> this._scatterTarget;

        this.houseOffset = 1;
    }

    reset(): void {
        super.reset();

        this.direction = new DirectionInfo(Direction.Up, Direction.Up);
        this._state = GhostState.Normal;
        this._movementMode = GhostMovementMode.InHouse;

        this.mover = new GhostInsideHouseMover(this, this.maze);
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

        const myPos = this.getTile().index;

        const distance = Math.abs(Vector2D.distanceBetween(myPos.toVector2D(), pacCellPos.toVector2D()));

        if (distance >= 8) {
            return pacCellPos;
        }

        return this._scatterTarget;
    }

    draw(canvas: Canvas): void {
        super.draw(canvas);

        if (Diags.enabled) {
            this.maze.highlightCell(canvas, this._getChaseTargetCell(), "orange");
        }
    };
}