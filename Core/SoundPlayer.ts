/// <reference types="howler"/>

declare var Howl: any;

export class SoundPlayer {

    private _loaded: boolean;

    private readonly _howl: Howl;

    constructor(path: string, whenLoaded: () => void) {

        this._howl = new Howl({
            src: [path]
        });

        this._howl.on("load", () => {
            whenLoaded();
            this._loaded = true;
        });

        this._howl.on("loaderror", () => {
            whenLoaded();
            this._loaded = true;
        });
    }

    get volume(): number {
        return this._howl.volume();
    }

    set volume(value: number) {
        this._howl.volume(value);
    }

    get isPlaying() {
        return this._howl.playing();
    }

    set loop(value: boolean) {
        this._howl.loop(value);
    }

    mute() {
        return this._howl.mute(true);
    }

    unmute() {
        return this._howl.mute(false);
    }

    get isLoaded() {
        return this._loaded;
    }

    stop() {
        this._howl.stop();
    }

    play() {
        if (!this.isLoaded) {
            throw new Error(`Not loaded!`);
        }

        if (this._howl.loop() && this._howl.playing()) {
            return;
        }

        this._howl.play();
    }

    tryPlay() {
        if (this._howl.loop() && !this._howl.playing()) {
            return;
        }

        this._howl.play();
    }
}
