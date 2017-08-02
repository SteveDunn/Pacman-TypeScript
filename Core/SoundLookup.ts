import {SoundPlayer} from "./SoundPlayer";

export interface SoundLookup {
    [soundName: number]: SoundPlayer;
}