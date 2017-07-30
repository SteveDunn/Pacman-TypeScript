import { GameContext, Keyboard, Point, Vector2D } from "../Core/_exports";
import { MainWindow, Constants, GhostFrightSession, Tile, IActor, Direction, DirectionToIndexLookup, Maze } from "../Game/_exports";

import { GhostEyesBackToHouseMover } from "./GhostEyesBackToHouseMover";
import { GhostInsideHouseMover } from "./GhostInsideHouseMover";
import { GhostScatterMover } from "./GhostScatterMover";
import { GhostChaseMover } from "./GhostChaseMover";
import { SimpleGhost } from "./SimpleGhost";
import { GhostState } from "./GhostMode";
import { GhostNickname } from "./GhostNickname";
import { GhostFrightenedMover } from "./GhostFrightenedMover";
import { GhostMover } from "./GhostMover";
import { DirectionInfo } from "./DirectionInfo";
import {GhostMovementMode} from "./GhostMovementMode";

export class Ghost extends SimpleGhost implements IActor {
    protected houseOffset: number;

    private _whenInCenterOfNextTile: Function;

    private readonly _tile: Tile;

    private _velocity: Vector2D;

    protected mover: GhostMover;
    protected directionLookup = new DirectionToIndexLookup();

    private _isMoving: boolean;
    private _isAnimating: boolean;

    getChaseTarget: () => Point;
    getScatterTarget: () => Point;

    constructor(
        public readonly name: string,
        public readonly nickName: GhostNickname,
        public readonly maze: Maze,
        private readonly _startingPoint: Point,
        private readonly _startingDirection: Direction) {
            super(nickName, _startingDirection);
            this._tile = new Tile();
    }

    powerPillEaten(session: GhostFrightSession) {
        super.powerPillEaten(session);

        if (this._state === GhostState.Eyes) {
            return;
        }

        this._state = GhostState.Frightened;

        if (this._movementMode === GhostMovementMode.Chase || this._movementMode === GhostMovementMode.Scatter) {
            this._whenInCenterOfNextTile = () => {
                const currentDirection = this.direction.currentDirection;

                if (currentDirection === Direction.Up) {
                    this.direction.update(Direction.Down);
                } else if (this.direction.currentDirection === Direction.Down) {
                    this.direction.update(Direction.Up);
                } else if (this.direction.currentDirection === Direction.Left) {
                    this.direction.update(Direction.Right);
                } else if (this.direction.currentDirection === Direction.Right) {
                    this.direction.update(Direction.Left);
                }

                this.mover = new GhostFrightenedMover(this, this.maze);
            };
        }
    }

    setMovementMode(mode: GhostMovementMode) {
        this._movementMode = mode;
    }

    reset(): void {
        this.visible = true;
        this._isMoving = true;
        this._isAnimating = true;

        this._state = GhostState.Normal;
        this._movementMode = GhostMovementMode.InHouse;

        this._whenInCenterOfNextTile = () => { };

        this._tile.set(Tile.toCenterCanvas(this._startingPoint));

        this.canvasPos = this._tile.center;

        this.direction = new DirectionInfo(this._startingDirection, this._startingDirection);

        this._spritesheetPos = this.spritesheetInfoNormal.getSourcePosition(this.direction.nextDirection, true);
    }

    get offsetInHouse(): number {
        return this.houseOffset;
    }

    get position(): Point {
        return this.canvasPos;
    }

    recentreInLane() {
        if (!(this._movementMode === GhostMovementMode.Chase || this._movementMode === GhostMovementMode.Scatter)) {
            return;
        }

        const tileCenter = this._tile.center;

        const speed = this.getSpeed();
        const currentDirection = this.direction.currentDirection;

        if (currentDirection === Direction.Down || currentDirection === Direction.Up) {
            const wayToMove = new Point(speed, 0);

            if (this.position.x > tileCenter.x) {
                this.position = this.position.minus(wayToMove);
                this.position = new Point(Math.max(this.position.x, tileCenter.x), this.position.y);
            } else if (this.position.x < tileCenter.x) {
                this.position = this.position.add(wayToMove);
                this.position = new Point(Math.min(this.position.x, tileCenter.x), this.position.y);
            }
        }

        if (currentDirection === Direction.Left || currentDirection === Direction.Right) {
            const wayToMove = new Point(0, speed);

            if (this.position.y > tileCenter.y) {
                this.position = this.position.minus(wayToMove);
                this.position = new Point(this.position.x, Math.max(this.position.y, tileCenter.y));
            } else if (this.position.y < tileCenter.y) {
                this.position = this.position.add(wayToMove);
                this.position = new Point(this.position.x, Math.min(this.position.y, tileCenter.y));
            }
        }

    }

    set position(pos: Point) {
        const diffAsPoint = pos.minus(this.canvasPos);

        const diff = diffAsPoint.toVector2D();

        if (diff.equals(Vector2D.zero)) {
            return;
        }

        this.canvasPos = pos;
        this._tile.set(pos);
        this.handleWrapping();
    }

    getSpeed = (): number => {
        if (this._movementMode === GhostMovementMode.InHouse) {
            return .25;
        }

        if (this._state === GhostState.Eyes) {
            return 2;
        }

        const levelProps = MainWindow.gameStats.currentPlayerStats.levelStats.levelProps;

        const baseSpeed = Constants.ghostBaseSpeed;

        if (this._state === GhostState.Frightened) {
            return baseSpeed * (levelProps.frightGhostSpeedPc / 100);
        }

        if (this.maze.isInTunnel(this._tile.index)) {
            return baseSpeed * (levelProps.ghostTunnelSpeedPc / 100);
        }

        return baseSpeed * (this.getNormalGhostSpeedPercent() / 100);
    }

    // virtual (Blinky has different speeds depending on how many dots are left)
    getNormalGhostSpeedPercent(): number {
        return MainWindow.gameStats.currentPlayerStats.levelStats.levelProps.ghostSpeedPc;
    }

    getTile(): Tile {
        return this._tile;
    }

    set direction(directionInfo: DirectionInfo) {

        // FROM https://msdn.microsoft.com/en-gb/magazine/dn890374.aspx
        // There's no way to prevent some members from not being inherited.
        // A derived class inherits all members of the base class, including 
        // public and private members (all public members of the base class 
        // are overrideable while private members are not). To override a 
        // public member, simply define a member in the derived class with 
        // the same signature.While you can use the super keyword to access 
        // a public method from a derived class, you can't access a property 
        // in the base class using super (though you can override the property).

        this._direction = directionInfo;

        this._velocity = DirectionToIndexLookup.indexVectorFor(directionInfo.currentDirection).multiply(this.getSpeed());
    }

    get direction(): DirectionInfo {
        return this._direction;
    }

    moveForwards = () => {
        const v = DirectionToIndexLookup.indexVectorFor(this.direction.currentDirection).multiply(this.getSpeed());
        this.position = this.canvasPos.add(v.toPoint());
    }

    handleWrapping = () => {
        const nextTile = this._tile.nextTile(this.direction.currentDirection);

        if (nextTile.index.x < -1) {
            const newPos = Tile.fromIndex(nextTile.index.add(new Point(29, 0)));
            this.canvasPos = newPos.center;
            this._tile.set(this.canvasPos);
        } else if (nextTile.index.x > 29) {
            const newPos = Tile.fromIndex(nextTile.index.minus(new Point(29, 0)));
            this.canvasPos = newPos.center;
            this._tile.set(this.canvasPos);
        }
    }

    stopMoving(): void {
        this._isMoving = false;
    }

    stopAnimating(): void {
        this._isAnimating = false;
    }

    update(context: GameContext): void {
        super.update(context);

        if (!this._isMoving) {
            return;
        }

        this.recentreInLane();
        this.collisionDetection();

        if (this._tile.isNearCenter) {
            this._whenInCenterOfNextTile();
            this._whenInCenterOfNextTile = () => { };
        }

        this.setMoverAndMode();

        this.mover.update(context);

        if (this._state === GhostState.Frightened) {
            if (MainWindow.gameStats.currentPlayerStats.frightSession.isFinished) {
                this._state = GhostState.Normal;
            }
        }
    }

    private setNextScatterOrChaseMoverAndMode(): void {
        const nextMode = MainWindow.gameStats.currentPlayerStats.ghostMoveConductor.currentMode;

        if (this._movementMode === nextMode) {
            return;
        }

        this._movementMode = nextMode;

        if (this._movementMode === GhostMovementMode.Scatter) {
            this.mover = new GhostScatterMover(this, this.maze);
            return;
        }

        if (this._movementMode === GhostMovementMode.Chase) {
            this.mover = new GhostChaseMover(this, this.maze);
            return;
        }

        throw new Error("Don't know what mover to create!");

    }

    private setMoverAndMode(): void {
        const isScatterOrChase = this._movementMode === GhostMovementMode.Undecided
            || this._movementMode === GhostMovementMode.Chase
            || this._movementMode === GhostMovementMode.Scatter;

        if (isScatterOrChase) {
            this.setNextScatterOrChaseMoverAndMode();
            return;
        }

        if (this._movementMode === this.mover.movementMode) {
            return;
        }

        //sets ghost movement mode to unknown at end
        if (this._movementMode === GhostMovementMode.InHouse) {
            this._state = GhostState.Normal;
            this.mover = new GhostInsideHouseMover(this, this.maze);
            return;
        }

        if (this._movementMode === GhostMovementMode.GoingToHouse) {
            this.mover = new GhostEyesBackToHouseMover(this, this.maze);
            return;
        }

        //sets ghost movement mode to unknown at end
        if (this._movementMode === GhostMovementMode.Frightened) {
            this.mover = new GhostFrightenedMover(this, this.maze);
            return;
        }

        throw new Error("Don't know what mover to create and set!");
    }

    collisionDetection(): void {
        if (this._tile.index.equals(MainWindow.actors.pacMan.getTile().index)) {
            if (this._state === GhostState.Normal) {
                //cheat:
                if (GameContext.keyboard.isKeyDown(Keyboard.five)) {
                    MainWindow.pacManEaten();

                }
                //cheat
                MainWindow.pacManEaten();
            }

            if (this._state === GhostState.Frightened) {
                MainWindow.ghostEaten(this);
                this._state = GhostState.Eyes;
                this._movementMode = GhostMovementMode.GoingToHouse;
            }
        }
    }
}

