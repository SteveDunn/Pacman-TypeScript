import { GhostMovementMode } from "./GhostMovementMode";
import { GameContext } from "../Core/_exports";
import { GhostsLevelPatternProperties } from "./GhostsLevelPatternProperties";
import {ModeAndDuration} from "./ModeAndDuration";

export class GhostMovementConductor {
    private _index: number;

    private readonly _items: ModeAndDuration[];

    constructor(readonly properties: GhostsLevelPatternProperties) {
        this._index = -1;
        this._items = [];

        this._items.push(new ModeAndDuration(GhostMovementMode.Scatter, properties.scatter1*1000));
        this._items.push(new ModeAndDuration(GhostMovementMode.Chase, properties.chase1*1000));

        this._items.push(new ModeAndDuration(GhostMovementMode.Scatter, properties.scatter2*1000));
        this._items.push(new ModeAndDuration(GhostMovementMode.Chase, properties.chase2*1000));

        this._items.push(new ModeAndDuration(GhostMovementMode.Scatter, properties.scatter3*1000));
        this._items.push(new ModeAndDuration(GhostMovementMode.Chase, properties.chase3*1000));

        this._items.push(new ModeAndDuration(GhostMovementMode.Scatter, properties.scatter4*1000));
        this._items.push(new ModeAndDuration(GhostMovementMode.Chase, properties.chase4*1000));

        this.incrementIndex();
    }

    update(context: GameContext) {
        const item = this._items[this._index];

        item.duration -= context.elapsed;

        if (item.duration < 0) {
            this.incrementIndex();
        }
    }

    incrementIndex(): void {
        this._index += 1;
        if (this._index >= this._items.length) {
            throw new Error("No more move patterns!?");
        }
    }

    get currentMode(): GhostMovementMode {
        return this._items[this._index].mode;
    }
}