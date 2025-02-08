import { GameConfig, UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { SoundMan } from "../soundman";
import { gVar, gConst } from "../global";

export class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerScene' });
    }

    preload() : void {
        
    }

    create() : void {
        KeyMap.initialize(this);
    }
}
