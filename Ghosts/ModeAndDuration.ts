import { GhostMovementMode } from "./GhostMovementMode";

export class ModeAndDuration {
    constructor(public readonly mode: GhostMovementMode, public duration: number) {
    }
}