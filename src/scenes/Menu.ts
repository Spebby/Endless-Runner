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

        KeyMap.keyRESET.on('down', (event : KeyboardEvent) => {
            if (event.shiftKey && 0 < gVar.highScore) this.resetHighscore();
        });
        KeyMap.keySELECT.onDown = () => {
            this.changeScene();
        }

        // setup UI.
        

        let hHeight = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  = parseInt(GameConfig.scale.width  as string) / 2;

        // display menu text
        // menuConfig.backgroundColor = '#00FF00';
        this.add.text(hWidth, hHeight * 0.5, `Wingman`, gConst.menuConfig).setOrigin(0.5).setFontSize('128px');
        this.add.text(hWidth, (hHeight * 0.9) + 4 * (UIConfig.borderUISize + UIConfig.borderPadding), `-PRESS SELECT-`, gConst.menuConfig).setOrigin(0.5);
        if (0 < gVar.highScore) {
            this.hsText = this.add.text(hWidth, hHeight + 4 * (UIConfig.borderUISize + UIConfig.borderPadding), `High Score: ${gVar.highScore}`, gConst.menuConfig).setOrigin(0.5).setFontSize('24px');
        }
    }

    changeScene() : void {
        SoundMan.play('select');
        this.scene.start('PlayScene');
    }

    resetHighscore() : void {
        SoundMan.playUnweight('explosions');
        document.cookie = `highscore=0; expires=Fri, 1, Jan 1, 23:59:59 GMT; path=/`;
        gVar.highScore  = 0;
        this.hsText.text = ``;
    }
}
