import { GhostNickname, Ghost, Inky, Pinky, Blinky, Clyde } from "../Ghosts/_exports";

import { Fruit } from "./Fruit";
import { Maze } from "./Maze";
import { PacMan } from "./PacMan";

export class Actors {
    private readonly _maze: Maze;
    private readonly _pacMan: PacMan;

    private readonly _fruit: Fruit;

    private readonly _blinky: Blinky;
    private readonly _pinky: Pinky;
    private readonly _inky: Inky;
    private readonly _clyde: Clyde;

    private readonly _ghosts: Ghost[];

    constructor() {
        this._maze = new Maze();
        this._maze.loadContent();

        this._pacMan = new PacMan();
        this._fruit = new Fruit();

        this._blinky = new Blinky(this._maze);
        this._pinky = new Pinky(this._maze);
        this._inky = new Inky(this._maze, this._blinky);
        this._clyde = new Clyde(this._maze);

        //debug:
//        this._ghosts = [this.blinky];
        this._ghosts = [
            this._blinky, this._pinky, this._inky, this._clyde
        ];
    }

    getGhost(nickName: GhostNickname) {
        const index = this._ghosts.findIndex(g => g.nickName === nickName);
        return this._ghosts[index];
    }

    get ghosts(): Ghost[] {
        return this._ghosts;
    }

    get pacMan(): PacMan {
        return this._pacMan;
    }

    get fruit(): Fruit {
        return this._fruit;
    }

    get maze(): Maze {
        return this._maze;
    }
}