import { GameContext } from "./GameContext";
import { Point } from "./Point";
import { Vector2D } from "./Vector2D";
import { Canvas } from "./Canvas";

export abstract class Sprite {

    loadContent(): void { // nothing 
    };

    abstract get position():Point;

    abstract update(context: GameContext): void;

    abstract draw(canvas: Canvas): void;

    abstract get origin(): Point;

    abstract get size(): Vector2D;

    abstract get spriteSheet(): HTMLImageElement;

    abstract get spriteSheetPos(): Point;
}
