import {Vector2D} from "../Core/_exports";

import { Direction } from "./Direction";

export class DirectionToIndexLookup {
    private static readonly lookup = new Array<Vector2D>();

    constructor() {
        DirectionToIndexLookup.lookup[Direction.Up] = new Vector2D(0, -1);

        DirectionToIndexLookup.lookup[Direction.Down] = new Vector2D(0, 1);

        DirectionToIndexLookup.lookup[Direction.Left] = new Vector2D(-1, 0);

        DirectionToIndexLookup.lookup[Direction.Right] = new Vector2D(1, 0);
    }

    static indexVectorFor(direction: Direction): Vector2D {
        return DirectionToIndexLookup.lookup[direction];
    }

    static getDirectionFromVector = (vector: Vector2D): Direction => {
        const unitVector = vector.copy();
         unitVector.normalize();
        
        if(unitVector.x < 0) {
            return Direction.Left;
        }
        if(unitVector.x > 0) {
            return Direction.Right;
        }
        if(unitVector.y < 0) {
            return Direction.Up;
        }
        if(unitVector.y > 0) {
            return Direction.Down;
        }

        return Direction.None;
    }
    
    static offset(direction: Direction, position: Vector2D): Vector2D {
        return DirectionToIndexLookup.lookup[direction].add(position);
    }
}
