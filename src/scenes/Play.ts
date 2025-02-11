import { GameObjects } from "phaser";
import { GameConfig, UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { SoundMan } from "../soundman";
import { gVar, gConst } from "../global";

import { Player }  from "../objects/player";
import { UIScene } from "./UI";

export class PlayScene extends Phaser.Scene {
    private player : Player;


    private score  : number  = 0;
    private paused : boolean = false;

    // To make the ship smoothly come to a stop at top of the world, and not
    // intrude upon UI.
    private mouseCap     : number = 4960;
    private initGravity  : number;
    private minGravityMultiplier : number = 0.5;
    private atmosphereHeight : number;
    private worldHeight  : number = 5000;

    private bonusFloor   : number = 1500;
    private maxBonusMultiplier : number = 3;

    private hasPlayed : boolean;
    private UIScene   : UIScene;

    constructor() {
        super({ key: 'PlayScene' });
    }

    create() : void {
        KeyMap.initialize(this);
        
        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');
        this.UIScene = this.scene.manager.getScene('UIScene') as UIScene;
        this.UIScene.input.enabled = false;

        this.initGravity = this.physics.world.gravity.y;
        this.atmosphereHeight = this.worldHeight * 0.67;

        this.hasPlayed = (gVar.highScore > 0);

        let hHeight : number = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  : number = parseInt(GameConfig.scale.width  as string) / 2;

        let mapT = this.add.image(0,     0, 'bgBottom').setOrigin(0, 1);
        let mapB = this.add.image(0, -2500, 'bgTop').setOrigin(0, 1);

        // phaser being Y up is really awful to work with, so I'm swapping it.
        this.physics.world.setBounds(0, -this.worldHeight, hWidth, this.worldHeight);

        this.player = new Player(this, 32 + UIConfig.borderPadding, -500, 'player');
        this.player.anims.play('p-idle');
        //this.player.setCollideWorldBounds(true, 0, 0);

        this.cameras.main.setBounds(0, -this.worldHeight, hWidth, this.worldHeight);
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 32 - hWidth, 0);

        let t = this.physics.world.bounds;
        console.log(`World Bounds: (${t.left}, ${t.right}, ${t.top}, ${t.bottom})`);

        // debug key
        KeyMap.keyDEBUG.onDown = () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }
        this.physics.world.drawDebug = false;

        KeyMap.keyEXIT.on('down', () => {
            if (!this.hasPlayed) {
                this.toggleOverlay();
                this.hasPlayed = true;
                this.physics.world.resume();
            } else {
                this.togglePause();
            }
        });

        if (!this.hasPlayed) {
            this.physics.world.pause();
        }
    }

    update(time : number, delta : number) : void {
        if (!this.hasPlayed || this.paused) {
            return;
        }

        // activePointer doesn't updateWorldPoint unless
        // DOM detect movements. This is manually overwriting that.
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        this.input.activePointer.worldY = Phaser.Math.Clamp(this.input.activePointer.worldY, -this.mouseCap, 0);
        this.physics.world.gravity.y = this.calculateGravity(-this.player.y);

        let altitude = this.getAltitude();

        this.player.update(time, delta);

    let bonusMultipler = 1;
        if (altitude > this.bonusFloor) {
            let k = -2/Math.pow((this.worldHeight - this.bonusFloor), 2);
            bonusMultipler = k * Math.pow((this.worldHeight - altitude), 2) + this.maxBonusMultiplier;
        }
        this.score += (this.player.body.velocity.x * bonusMultipler) * (delta / 1000);
    }

    calculateGravity(height : number) : number {
        if (height < this.atmosphereHeight) {
            return this.initGravity;
        } else {
            // extreme levels of swag
            let k = ((1/(2 * Math.pow((this.worldHeight - this.atmosphereHeight), 2))));
            return this.initGravity * k * Math.pow((this.worldHeight - height), 2) + this.minGravityMultiplier;
            // this equation evaluates 1 when height = this.atmosphereHeight.
            // When height = 5000, multiplier is ~0.5.
        }
    }

    getAltitude() : number {
        return Math.floor(-this.player.y - 13);
    }

    getSpeed() : number {
        return this.player.body.velocity.length();
    }

    getScore() : number {
        return this.score;
    }

    toggleOverlay() {
        SoundMan.play('uiBlip');
        this.UIScene.toggleOverlay();
    }

    togglePause() {
        SoundMan.play('select');
        if (this.paused) {
            this.physics.world.resume();
        } else {
            this.physics.world.pause();
        }
        this.UIScene.togglePause();
        this.paused = !this.paused;
    }
}
