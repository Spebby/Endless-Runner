import { GameObjects } from "phaser";
import { GameConfig, UIConfig } from "../config";
import { gVar, gConst } from "../global";
import { SoundMan } from "../soundman";
import { PlayScene } from "./Play";

export class UIScene extends Phaser.Scene {
    private scoreText   : GameObjects.Text;
    private altitude    : GameObjects.Text;
    private speedometer : GameObjects.Text;
    private pausedText  : GameObjects.Text;

    private overlay     : GameObjects.Container;

    // I imagine there's a far better way than doing this
    // (probably event based) but don't have time for that rn
    private PlayScene : PlayScene;

    constructor() {
        super({ key: 'UIScene' });
    }

    create() : void {
        this.input.enabled = false;
        this.PlayScene = this.scene.manager.getScene('PlayScene') as PlayScene;

        let hHeight : number = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  : number = parseInt(GameConfig.scale.width  as string) / 2;

        this.scoreText   = this.add.text(UIConfig.borderPadding, UIConfig.borderPadding + 8, '', gConst.uiConfig)
            .setOrigin(0, 0.5)
            .setFontSize('32px');
        this.altitude    = this.add.text(UIConfig.borderPadding, this.scoreText.x + 32, '', gConst.uiConfig)
            .setOrigin(0, 0.5)
            .setFontSize('32px');
        this.speedometer = this.add.text(UIConfig.borderPadding, this.altitude.y + 32,  '', gConst.uiConfig)
            .setOrigin(0, 0.5)
            .setFontSize('32px');
        this.scoreText.setScrollFactor(0);
        this.altitude.setScrollFactor(0);
        this.speedometer.setScrollFactor(0);

        this.pausedText = this.add.text(hWidth, UIConfig.borderPadding + 8, '', gConst.uiConfig)
            .setOrigin(0.5, 0.5)
            .setFontSize('32px');
        this.pausedText.setScrollFactor(0);

        this.overlay  = this.add.container(hWidth, hHeight);
        let overlayBg = this.add.rectangle(0, 0, 2 * hWidth, 2 * hHeight, 0x282c34, 0.5)
            .setOrigin(0.5);

        let text = this.add.text(0, 0, '', gConst.uiPopup)
            .setOrigin(0.5);

        text.text =   'Welcome to Fly-By!\n'
                    + 'Control your glider\'s pitch with your mouse position\n'
                    + 'Fly high, avoid hitting the bottom of the world, or any enemies.\n'
                    + 'The farther (and higher) you fly, the better your score.\n'
                    + 'Collect coins for extra score, and balloons for a boost in height.\n\n'
                    + 'Press the Escape key to pause and unpause the game,\n'
                    + 'as well as exiting this popup.\n'
                    + 'Press R while paused to reset the scene! Your score will be saved.';

        this.overlay.add([overlayBg, text]); 
    }

    update(delta : number, time : number) {
        this.altitude.text    = `Altitude: ${this.PlayScene.getAltitude()}m`;
        this.speedometer.text = `Speed   : ${Math.floor(this.PlayScene.getSpeed())}m`;
        this.scoreText.text   = `Score: ${Math.floor(this.PlayScene.getScore())}`;
    }

    toggleOverlay() {
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
                } else {
                    this.overlay.setInteractive();
                }
            }
        });
    }

    private paused : boolean;
    togglePause() {
        SoundMan.play('select');
        if (this.paused) {
            this.pausedText.text = '';
        } else {
            this.pausedText.text = '-Paused-';
        }
        this.paused = !this.paused;
    }
}
