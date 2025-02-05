import { GameConfig, UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { gVars, gConst } from "../global";
import { SoundMan } from "../soundman";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() : void {
        //this.load.image('rocket', `${assetPath}/rocket.png`);
        
        // load spritesheet
        //this.load.spritesheet('explosion', `${assetPath}/explosion.png`, {
        //    frameWidth: 32,
        //    frameHeight: 32,
        //    startFrame: 0,
        //    endFrame: 9
        //});

        SoundMan.add('select', 'sfx-select');
        SoundMan.add('shot', 'sfx-shot');
        SoundMan.importJSON('soundData.json');
    }

    create() : void {
        KeyMap.initialize(this);

        // get highscore cookie
        for (const cookie of document.cookie.split("; ")) {
            const [key, value] = cookie.split("=");
            if (key === "highscore") {
                gVars.highScore = parseInt(decodeURIComponent(value));
                break;
            }
        }

        // animation configuration
        /*this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        });*/

        // setup UI.

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };

        let hHeight = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  = parseInt(GameConfig.scale.width  as string) / 2; 

        // display menu text
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(hWidth, hHeight + 2 * (UIConfig.borderUISize + UIConfig.borderPadding), `High Score: ${gVars.highScore}`, menuConfig).setOrigin(0.5);
    }

}
