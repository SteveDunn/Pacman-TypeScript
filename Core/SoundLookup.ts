import {MyAudio} from "./MyAudio";

export interface SoundLookup {
    [soundName: number]: MyAudio;
}