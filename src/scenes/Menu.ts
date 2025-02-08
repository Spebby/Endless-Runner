import { GameConfig, UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { gVar, gConst } from "../global";
import { SoundMan } from "../soundman";

export class MenuScene extends Phaser.Scene {
    private hsText : Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() : void {
        this.load.image('player', `${gConst.assetPath}/player.png`);

        SoundMan.init(this);
        SoundMan.add('select', 'sfx-select.wav');
        SoundMan.add('shot', 'sfx-shot.wav1');
        SoundMan.importJSON('soundData.json');
    }

    create() : void {
        KeyMap.initialize(this);

        // get highscore cookie
        for (const cookie of document.cookie.split("; ")) {
            const [key, value] = cookie.split("=");
            if (key === "highscore") {
                gVar.highScore = parseInt(decodeURIComponent(value));
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

        gVar.highScore = 100;

        KeyMap.keyRESET.on('down', (event : KeyboardEvent) => {
            if (event.shiftKey) this.resetHighscore();
        });
        KeyMap.keySELECT.onDown = () => {
            this.changeScene();
        };

        // setup UI.
        let menuConfig = {
            fontFamily: 'Chillen',
            fontSize: '32px',
            //backgroundColor: '#F3B141',
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
        // menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#FFFFFF';
        this.add.text(hWidth, hHeight * 0.5, `Wingman`, menuConfig).setOrigin(0.5).setFontSize('128px');
        this.add.text(hWidth, (hHeight * 0.9) + 4 * (UIConfig.borderUISize + UIConfig.borderPadding), `-PRESS SELECT-`, menuConfig).setOrigin(0.5);
        this.hsText = this.add.text(hWidth, hHeight + 4 * (UIConfig.borderUISize + UIConfig.borderPadding), `High Score: ${gVar.highScore}`, menuConfig).setOrigin(0.5).setFontSize('24px');
    }

    changeScene() : void {
        SoundMan.play('select');
        this.scene.start('PlayScene');
    }

    resetHighscore() : void {
        SoundMan.playUnweight('explosions');
        document.cookie = `highscore=0; expires=Fri, 1, Jan 1, 23:59:59 GMT; path=/`;
        gVar.highScore  = 0;
        this.hsText.text = `High Score: ${gVar.highScore}`;
    }
}
