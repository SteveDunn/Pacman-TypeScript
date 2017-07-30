import { Direction, Maze } from "../Game/_exports";
import { GameContext, Point, Vector2D } from "../Core/_exports";

import { GhostMovementMode } from "./GhostMovementMode";
import { Ghost} from "./Ghost";
import { GhostMover } from "./GhostMover";
import { DirectionInfo } from "./DirectionInfo";
import {MovementResult} from "./MovementResult";

/**
 * Moves the ghost back to the house.
 */
export class GhostEyesBackToHouseMover extends GhostMover {

    private readonly _ghostPosInHouse: Point;

    private _currentAction: (context: GameContext) => MovementResult;

    constructor(ghost: Ghost, maze: Maze) {
        super(ghost, GhostMovementMode.GoingToHouse, maze, () => Maze.tileHouseEntrance.index);

        this._ghostPosInHouse = Maze.pixelCenterOfHouse.add(new Point(ghost.offsetInHouse*16, 0));

        this._currentAction = this.navigateEyesBackToJustOutsideHouse;
    }

    private navigateEyesBackToJustOutsideHouse(context: GameContext): MovementResult {
        super.update(context);
        if (this.isNearHouseEntrance) {
            this.ghost.position = Maze.pixelHouseEntrancePoint;
            this._currentAction = this.navigateToCenterOfHouse;
        }

        return MovementResult.NotFinished;
    }

    private navigateToCenterOfHouse(context: GameContext): MovementResult {
        const diff = Maze.pixelCenterOfHouse.minus(Maze.pixelHouseEntrancePoint).toVector2D();

        if (!diff.equals(Vector2D.zero)) {
            diff.normalize();
            this.ghost.position = this.ghost.position.add(diff.toPoint());
        }

        if (this.ghost.position.round().equals(Maze.pixelCenterOfHouse)) {
            this._currentAction = this.navigateToGhostIndexInHouse;
        }

        return MovementResult.NotFinished;
    }

    private navigateToGhostIndexInHouse(context: GameContext): MovementResult {
        const diff = this._ghostPosInHouse.minus(Maze.pixelCenterOfHouse).toVector2D();

        if (!diff.equals(Vector2D.zero)) {
            diff.normalize();
            this.ghost.position = this.ghost.position.add(diff.toPoint());
        }

        if (this.ghost.position.round().equals(this._ghostPosInHouse)) {
            this.ghost.direction = new DirectionInfo(Direction.Down, Direction.Down);
            this.ghost.setMovementMode(GhostMovementMode.InHouse);
            return MovementResult.Finished;
        }

        return MovementResult.NotFinished;
    }

    update(context: GameContext): MovementResult {
        return this._currentAction(context);
    }

    get isNearHouseEntrance(): boolean {
        return Point.areNear(this.ghost.position, Maze.pixelHouseEntrancePoint, .75);
    }
}
