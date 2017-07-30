import { Canvas, GameContext } from "../Core/_exports";

import { TimedSprite } from "./TimedSprite";

export interface TimedSprites {
    [id: string]: TimedSprite;
}


export class TimedSpriteList {
    private sprites: TimedSprite[];
    constructor() {
        this.sprites = [];
    }

    add(sprite: TimedSprite) {
        this.sprites.push(sprite);
    }

    update(context: GameContext) {
        this.sprites.forEach(s => s.update(context));

        for (let i = this.sprites.length - 1; i >= 0; i--) {
            if (this.sprites[i].expired) {
                this.sprites.splice(i, 1);
                break;
            }
        }
    }

    draw(canvas: Canvas) {
        this.sprites.forEach(s => s.draw(canvas));
    }
}
