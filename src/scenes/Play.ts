import { GameObjects } from "phaser";
import { GameConfig, UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { SoundMan } from "../soundman";
import { gVar, gConst } from "../global";

import { Player } from "../objects/player";

export class PlayScene extends Phaser.Scene {
    private player : Player;

    private altitude : GameObjects.Text;
    private speedometer : GameObjects.Text;

    private UICam : Phaser.Cameras.Scene2D.Camera;
    // To make the ship smoothly come to a stop at top of the world, and not
    // intrude upon UI.
    private mouseCap : number;
    private initGravity  : number;
    private minGravityMultiplier : number = 0.5;
    private atmosphereHeight : number;
    private worldHeight : number = 5000;

    constructor() {
        super({ key: 'PlayScene' });
    }

    create() : void {
        KeyMap.initialize(this);
        this.initGravity = this.physics.world.gravity.y;
        this.atmosphereHeight = this.worldHeight * 0.67;

        let hHeight : number = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  : number = parseInt(GameConfig.scale.width  as string) / 2;

        this.add.image(0,     0, 'bgBottom').setOrigin(0, 1);
        this.add.image(0, -2500, 'bgTop').setOrigin(0, 1);

        this.altitude    = this.add.text(UIConfig.borderPadding, UIConfig.borderPadding + 8,  '', gConst.menuConfig).setOrigin(0, 0.5).setFontSize('32px');
        this.speedometer = this.add.text(UIConfig.borderPadding, UIConfig.borderPadding + 40, '', gConst.menuConfig).setOrigin(0, 0.5).setFontSize('32px');
        this.altitude.setScrollFactor(0);
        this.speedometer.setScrollFactor(0);

        // phaser being Y up is really awful to work with, so I'm swapping it.
        this.physics.world.setBounds(0, -this.worldHeight, hWidth, this.worldHeight);

        this.player = new Player(this, 32 + UIConfig.borderPadding, -500, 'player');
        this.player.anims.play('p-idle');
        //this.player.setCollideWorldBounds(true, 0, 0);

        this.cameras.main.setBounds(0, -this.worldHeight, hWidth, this.worldHeight);
        this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 32 - hWidth, 0);
        this.cameras.main.ignore([this.altitude, this.speedometer]);
        this.mouseCap = this.physics.world.bounds.top + 35;

        let UIList : GameObjects.GameObject[] = [this.altitude, this.speedometer];

        this.UICam = this.cameras.add(0, 0);
        this.UICam.ignore(this.children.list.filter(item => !UIList.includes(item)));

        let t = this.physics.world.bounds;
        console.log(`World Bounds: (${t.left}, ${t.right}, ${t.top}, ${t.bottom})`);

        // debug key
        KeyMap.keyDEBUG.onDown = () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }
    }

    update(time : number, delta : number) : void {
        // activePointer doesn't updateWorldPoint unless
        // DOM detect movements. This is manually overwriting that.
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        this.input.activePointer.worldY = Phaser.Math.Clamp(this.input.activePointer.worldY, this.mouseCap, 0);
        this.physics.world.gravity.y = this.calculateGravity(-this.player.y);

        this.altitude.text    = `Altitude: ${Math.floor(-this.player.y - 13)}m`;
        this.speedometer.text = `Speed   : ${Math.floor(this.player.body.velocity.length())}m`;
        this.player.update(time, delta);
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
}
