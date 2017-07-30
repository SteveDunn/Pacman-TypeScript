import { Keyboard } from "./Keyboard";

export class GameContext {
    static readonly showDiags: boolean = false;
    static readonly keyboard = new Keyboard();

    elapsed: number;
    totalGameTime: number = 0;
}