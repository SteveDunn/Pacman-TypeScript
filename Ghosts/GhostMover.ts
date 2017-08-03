import { Maze, Direction, DirectionToIndexLookup } from "../Game/_exports";
import { Point, GameContext } from "../Core/_exports";

import { GhostLogic } from "./GhostLogic";
import { GhostMovementMode } from "./GhostMovementMode";
import { Ghost } from "./Ghost";
import {MovementResult} from "./MovementResult";

/**
 * Represents the different ghost movers.  Ghost movements are either:
 * * Chase (chase after Pacman),
 * * Scatter (they scatter back to their 'home corners')
 * * Frightened (run away from Pacman)
 * * 'Eyes back to house' (they've been eaten by Pacman and are making their way back to the 'house')
 * * 'Inside house' (they're inside the house waiting to come out)
 */
export class GhostMover {
    private readonly _intersectionLogic: GhostLogic;

    protected directionLookup = new DirectionToIndexLookup();

    constructor(
        protected readonly ghost: Ghost,
        public readonly movementMode: GhostMovementMode,
        maze: Maze,
        private readonly _getTargetCell: () => Point) {
            this._intersectionLogic = new GhostLogic(maze, ghost);
    }


    update(context: GameContext): MovementResult  {
        const tile = this.ghost.getTile();

        // if a ghost is near the center of a cell, then get the 'next cell' and 
        // store where to go from there

        if (tile.isInCenter) {
            const targetCell = this._getTargetCell();
            const direction = this._intersectionLogic.getWhichWayToGo(targetCell);

            if (direction !== Direction.None) {
                this.setDirection(direction);
            }
        }

        this.ghost.moveForwards();

        return MovementResult.NotFinished;
    }

    activate() {
        this.ghost.setMovementMode(this.movementMode);
    }

    private setDirection(direction: Direction) {
        this.ghost.direction.update(direction);
    }
}
