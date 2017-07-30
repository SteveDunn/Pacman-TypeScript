import { Tile, MainWindow, Diags, Direction, DirectionToIndexLookup, Maze } from "../Game/_exports";
import { Canvas, Point } from "../Core/_exports";

import { GhostInsideHouseMover } from "./GhostInsideHouseMover";
import { GhostState } from "./GhostMode";
import { Ghost } from "./Ghost";
import { GhostNickname } from "./GhostNickname";
import { DirectionInfo } from "./DirectionInfo";
import {GhostMovementMode} from "./GhostMovementMode";

export class Pinky extends Ghost {
    constructor(public readonly maze: Maze) {

        super("Pinky", GhostNickname.Pinky, maze, Tile.fromCell(15.5, 11), Direction.Down);

        this.getScatterTarget = ()=> new Point(2, 0);
        this.getChaseTarget = this._getChaseTargetCell;
        this.houseOffset = 0;
    }

    reset(): void {
        super.reset();

        this.direction = new DirectionInfo(Direction.Down, Direction.Down);

        this._state = GhostState.Normal;
        this._movementMode = GhostMovementMode.InHouse;
          this.mover = new GhostInsideHouseMover(this, this.maze);
  }

    // Pac-Man’s current position and orientation, and selecting the location four tiles straight 
    // ahead of him. Works when PacMan is facing left, down, or right, but when facing upwards, 
    // it's also four tiles to the left 
    private _getChaseTargetCell = () => {
        var pacDir = MainWindow.actors.pacMan.getDirection();

        var pacTile = MainWindow.actors.pacMan.getTile().index;

        var offset = this.maze.constrainCell(
            pacTile.add(DirectionToIndexLookup.indexVectorFor(pacDir).multiply(4).toPoint()));

        // for the bug in the original pacman
        if (pacDir === Direction.Up) {
            offset = offset.add(new Point(-4, 0));
        }

        const newTarget = this.maze.constrainCell(pacTile.add(offset));

        return newTarget;
    }

    draw(canvas: Canvas): void {
        super.draw(canvas);
        if (Diags.enabled) {
            this.maze.highlightCell(canvas, this._getChaseTargetCell(), "pink");
        }
    };
}
