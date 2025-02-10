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
        this.load.path = gConst.assetPath;

        // Menu Assets
        this.load.image('title', 'title/title.png');
        this.load.image('titleBg', 'title/titleBg.png');
        this.load.spritesheet('startText', 'title/start.png', {
            frameWidth:  512,
            frameHeight: 128,
        });
        this.load.image('cog', 'title/cog.png');

        // Game Assets
        this.load.image('bgTop',    'backgrounds/bgTop.png');
        this.load.image('bgBottom', 'backgrounds/bgBottom.png');
        this.load.image('mountain', 'backgrounds/mountain.png');

        this.load.image('treesF', 'backgrounds/treesF.png');
        this.load.image('treesM', 'backgrounds/treesM.png');
        this.load.image('treesB', 'backgrounds/treesB.png');
        this.load.spritesheet('player', 'player.png', {
            frameWidth:  512,
            frameHeight: 512,
        });
        this.load.spritesheet('bird', 'bird.png', {
            frameWidth:  512,
            frameHeight: 512,
        });
        this.load.spritesheet('balloon', 'balloon.png', {
            frameWidth:  512,
            frameHeight: 512,
        });
        this.load.spritesheet('coin', 'coin.png', {
            frameWidth:  512,
            frameHeight: 512,
        });
        this.load.spritesheet('clouds', 'clouds.png', {
            frameWidth:  512,
            frameHeight: 512,
        });


        SoundMan.init(this);
        SoundMan.add('select', 'sfx-select.wav');
        SoundMan.add('shot', 'sfx-shot.wav1');
        SoundMan.importJSON('soundData.json');
    }

    create() : void {
        KeyMap.initialize(this);

        // Title Anims
        this.anims.create({
            key: 'startText',
            frameRate: 4,
            repeat: -1,
            yoyo: false,
            frames: this.anims.generateFrameNumbers('startText', { start: 0, end: 3 }),
        });


        // Object Anims
        this.anims.create({
            key: 'p-idle',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
        });
        this.anims.create({
            key: 'b-idle',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 5 }),
        });
        this.anims.create({
            key: 'coin',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 6 }),
        });
        this.anims.create({
            key: 'balloon',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('balloon', { start: 0, end: 6 }),
        });

        // Background Anims
        this.anims.create({
            key: 'cloud0',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('clouds', { start: 0, end: 2 }),
        });
        this.anims.create({
            key: 'cloud1',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('clouds', { start: 3, end: 5 }),
        });


        // get highscore cookie
        for (const cookie of document.cookie.split("; ")) {
            const [key, value] = cookie.split("=");
            if (key === "highscore") {
                gVar.highScore = parseInt(decodeURIComponent(value));
                break;
            }
        }

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
        this.add.text(hWidth, hHeight * 0.5, `Fly-By`, gConst.menuConfig).setOrigin(0.5).setFontSize('128px');
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
