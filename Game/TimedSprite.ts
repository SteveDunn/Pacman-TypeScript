import { Canvas, GameContext, Sprite } from "../Core/_exports";

export class TimedSprite {
    constructor(private ttl: number, public readonly sprite: Sprite) {

    }

    update(context: GameContext) {
        this.ttl -= context.elapsed;
    }

    get expired(): boolean {
        return this.ttl < 0;
    }

    draw(canvas: Canvas) {
        this.sprite.draw(canvas);
    }
}