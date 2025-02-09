import { GameConfig, UIConfig } from "../config";
import { KeyMap } from "../keymap";
import { SoundMan } from "../soundman";
import { gVar, gConst } from "../global";

import { Player } from "../objects/player";

export class PlayScene extends Phaser.Scene {
    private player : Player;
    private altitude : Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'PlayScene' });
    }

    create() : void {
        KeyMap.initialize(this);

        let hHeight : number = parseInt(GameConfig.scale.height as string) / 2;
        let hWidth  : number = parseInt(GameConfig.scale.width  as string) / 2;

        this.altitude = this.add.text(UIConfig.borderPadding, UIConfig.borderPadding + 5, ``, gConst.menuConfig).setOrigin(0, 0.5).setFontSize('32px');
        this.altitude.setScrollFactor(0);


        this.physics.world.setBounds(0, -8000, hWidth * 2, 8000);

        this.player = new Player(this, 32 + UIConfig.borderPadding, -hHeight, 'player');
        //this.player.setCollideWorldBounds(true, 0, 0);

        this.cameras.main.setBounds(0, -8000, hWidth * 2, 8100);
        this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 32 - hWidth, 0);

        let t = this.physics.world.bounds;
        console.log(`World Bounds: (${t.left}, ${t.right}, ${t.top}, ${t.bottom})`);

        // debug key
        KeyMap.keyDEBUG.onDown = () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true;
            this.physics.world.debugGraphic.clear();
        }

        let ground = this.physics.add.sprite(0,0, 'ground');
        ground.body.setImmovable(true);
        ground.setCollideWorldBounds(false);
    }

    update(time : number, delta : number) : void {
        this.altitude.text = `Altitude: ${Math.floor(-this.player.y - 13)}m`;
        this.player.update(time, delta);
    }
}
