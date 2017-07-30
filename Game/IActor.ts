import { Tile } from "./Tile";

export interface IActor {
    getTile(): Tile;
    reset(): void;
}
