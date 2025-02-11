import { GameConfig, UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { gVar, gConst, saveCookie } from "../global";
import { SoundMan } from "../soundman";

export class MenuScene extends Phaser.Scene {
    private hsText  : Phaser.GameObjects.Text;
    private overlay : Phaser.GameObjects.Container;
    //private overlay : Phaser.GameObjects.Rectangle;

    private menuCog : Phaser.GameObjects.Image;
    private menuCogInitScale : number;

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
        this.load.image('cog',   'title/cog.png');
        this.load.spritesheet('close', 'title/x.png', {
            frameWidth:  256,
            frameHeight: 256,
        });

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
        SoundMan.add('uiBlip', 'sfx/uiBlip.wav');
        SoundMan.add('select', 'sfx/select.wav');
        SoundMan.add('shot', 'sfx/shot.wav');
        SoundMan.importJSON('soundData.json');
    }

    create() : void {
        KeyMap.initialize(this);

        // Title Anims
        this.anims.create({
            key: 'startText',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNumbers('startText', { start: 0, end: 3 }),
        });
        this.anims.create({
            key: 'close',
            frameRate: 4,
            repeat: -1,
            yoyo: true,
            frames: this.anims.generateFrameNames('close', { start: 0, end: 2 })
        })

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
            frames: this.anims.generateFrameNumbers('balloon', { start: 0, end: 4 }),
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


        // Read Cookies
        for (const cookie of document.cookie.split("; ")) {
            const [key, value] = cookie.split("=");
            if (key === "highscore") {
                gVar.highScore = parseInt(decodeURIComponent(value));
            }
            if (key === "musicOn") {
                gVar.musicOn = (value === "true");
            }
        }

        KeyMap.keyRESET.on('down', (event : KeyboardEvent) => {
            if (event.shiftKey && 0 < gVar.highScore) this.resetHighscore();
        });
        KeyMap.keySELECT.onDown = () => {
            this.changeScene();
        }
        KeyMap.keyEXIT.on('down', (event : KeyboardEvent) => {
            if (this.overlay.scaleX === 1) {
                this.toggleMenu();
            }
        });

        // setup UI. 
        let hHeight = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  = parseInt(GameConfig.scale.width  as string) / 2;

        this.add.image(hWidth, hHeight, 'titleBg');
        let title = this.add.image(hWidth, hHeight / 2, 'title');
        title.setScale(0.75);

        let start = this.add.sprite(hWidth, (hHeight + hHeight / 2), 'startText');
        start.play('startText');
        start.setRotation(0.075);

        // display menu text
        // menuConfig.backgroundColor = '#00FF00';
        if (0 < gVar.highScore) {
            this.hsText = this.add.text(hWidth, hHeight + 4 * (UIConfig.borderUISize + UIConfig.borderPadding), `High Score: ${gVar.highScore}`, gConst.titleConfig).setOrigin(0.5).setFontSize('32px');
        }


        // Settings
        this.menuCog = this.add.image(0, 0, 'cog')
            .setInteractive().on('pointerdown', () => {
                this.toggleMenu();
            });
        this.menuCog.setSize(96, 96)
        this.menuCog.setDisplaySize(96, 96);
        this.menuCog.x = this.menuCog.width - (2 * UIConfig.borderPadding);
        this.menuCog.y = (2 * hHeight) + (2 * UIConfig.borderPadding) - this.menuCog.height;
        this.menuCogInitScale = this.menuCog.scaleX;

        this.menuCog.on('pointerover', () => {
            this.tweens.add({
                targets: this.menuCog,
                angle: 15,  // Tilt 15 degrees
                duration: 200,
                ease: 'Power2'
            });
        });

        this.menuCog.on('pointerout', () => {
            this.tweens.add({
                targets: this.menuCog,
                angle: 0,  // Reset to default
                duration: 200,
                ease: 'Power2'
            });
        });


        // add help/settings menu
        this.overlay  = this.add.container(hWidth, hHeight);
        let overlayBg = this.add.rectangle(0, 0, hWidth * 2, hHeight * 2, 0x282c34, 0.5)
        //    .setScale(1)
            .setOrigin(0.5)
            .setInteractive();

        let settingBg = this.add.rectangle(0, (1.5 * UIConfig.borderPadding) - hHeight * 0.65, hWidth * 2 - UIConfig.borderPadding * 2, hHeight * 0.75, 0x282c34, 0.25)
            .setOrigin(0.5);
        let settingTitle = this.add.text(0, UIConfig.borderPadding + UIConfig.borderUISize - hHeight, 'Settings', gConst.settingsConfig)
            .setOrigin(0.5)
            .setFontSize('64px');

        let toggleMusic = this.add.text(0, settingTitle.y + UIConfig.borderUISize * 1.5, 'Disable Music [ ]', gConst.settingsConfig)
            .setOrigin(0.5)
            .setInteractive().on('pointerdown', () => {
                SoundMan.play('uiBlip');
                gVar.musicOn = !gVar.musicOn;
                saveCookie('musicOn', gVar.musicOn);
                let nChar = gVar.musicOn ? ' ' : 'X';
                toggleMusic.text = `Disable Music [${nChar}]`;
            });

        let buttonText = this.add.text(0, 0, '', gConst.settingsConfig)
            .setOrigin(0.5);
        buttonText.text = 'Press Enter to start the Game\n'
                        + 'Escape Key to close Settings Menu\n'
                        + 'Shift + R to reset your High Score\n';

        let credits = this.add.text(0, hHeight / 2 + UIConfig.borderPadding * 4, 'Credits', gConst.settingsConfig)
            .setOrigin(0.5)
            .setFontSize('64px');
        let creditProg = this.add.text(0, credits.y + UIConfig.borderUISize, "Thom \'Spebby\' Mott", gConst.settingsConfig)
            .setOrigin(0.5)
            .setFontSize('32px');

        let cancel = this.add.sprite(0, 0, 'cancel')
            .setInteractive().on('pointerdown', () => {
                this.toggleMenu();
            });
        cancel.play('close');
        cancel.setSize(96, 96)
        cancel.setDisplaySize(96, 96);
        cancel.x = cancel.width - (2 * UIConfig.borderPadding) - hWidth;
        cancel.y = hHeight + (2 * UIConfig.borderPadding) - cancel.height;

        cancel.on('pointerover', () => {
            this.tweens.add({
                targets: cancel,
                scale: this.menuCogInitScale * 1.1,  // Tilt 15 degrees
                duration: 200,
                ease: 'Power2'
            });
        });

        cancel.on('pointerout', () => {
            this.tweens.add({
                targets: cancel,
                scale: this.menuCogInitScale,  // Reset to default
                duration: 200,
                ease: 'Power2'
            });
        });

        this.overlay.add([overlayBg, buttonText, settingBg, settingTitle, toggleMusic, credits, creditProg, cancel]);
    }

    changeScene() : void {
        SoundMan.play('select');
        this.scene.start('PlayScene');
    }

    toggleMenu() : void {
        // funny bug: user could spam click and make the settings menu impossible to access
        this.menuCog.disableInteractive();
        SoundMan.play('uiBlip');
        this.tweens.add({
            targets: this.overlay,
            scaleX:  this.overlay.scaleX === 0 ? 1 : 0,
            scaleY:  this.overlay.scaleY === 0 ? 1 : 0,
            duration: 500,
            ease:    this.overlay.scaleX === 1 ? 'Quad.easeIn' : 'Quad.easeOut',
            onComplete: () => {
                if (this.overlay.scaleX === 0) {
                    this.overlay.disableInteractive();
                    this.menuCog.setInteractive();
                } else {
                    this.menuCog.disableInteractive();
                    this.overlay.setInteractive();
                }
            }
        });

        this.tweens.add({
            targets: this.menuCog,
            scaleX:  this.overlay.scaleX === 1 ? this.menuCogInitScale : 0,
            scaleY:  this.overlay.scaleY === 1 ? this.menuCogInitScale : 0,
            duration: 500,
            ease:    this.menuCog.scaleX === this.menuCogInitScale ? 'Quad.easeIn' : 'Quad.easeOut',
        });
    }

    resetHighscore() : void {
        SoundMan.playUnweight('explosions');
        document.cookie = `highscore=0; expires=Fri, 1, Jan 1, 23:59:59 GMT; path=/`;
        gVar.highScore  = 0;
        this.hsText.text = ``;
    }
}
