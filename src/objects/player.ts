import { GameObjects, Physics } from 'phaser';
import { Math as pMath } from 'phaser';
import {KeyMap} from '../keymap';
import {SoundMan} from '../soundman';
import {gVar} from '../global';

const { sin, cos, tan, asin, acos, atan, PI } = Math;

export class Player extends Physics.Arcade.Sprite {
    // body is reserved by Sprite
    private drag : number = 0.99;
    private terminalVelocity : number = 400;
    private glideSpeed = 0.1;

    constructor(scene : Phaser.Scene, x : number, y : number, texture : string) {
        super(scene, x, y, texture, 0);
        console.log(x, y);

        this.setOrigin(0.5, 0.5);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(this.width, this.height);
        //this.setDamping(true);
        //this.setDrag(this.drag);
        this.setMaxVelocity(this.terminalVelocity);
        this.setVelocityX(100);
    }

    /** 
    * @time The current time.
    * @delta The delta time in ms since last frame. This is smoothed and capped based on FPS.
    * @ref https://docs.phaser.io/api-documentation/event/scenes-events#update
    */
    update(time : number, delta : number) : void {
        /*if (KeyMap.keyLEFT.isDown || KeyMap.keyUP.isDown) {
            this.rotation -= 0.05;
        } else if (KeyMap.keyRIGHT.isDown || KeyMap.keyDOWN.isDown) {
            this.rotation += 0.05;
        }*/
        // Clamp rotation [-π/2 ... π/2]
        var pos : pMath.Vector2 = new pMath.Vector2(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY).subtract(this.body.position);
        //console.log(`rPos: <${Math.round(rawPos.x * 100) / 100}, ${Math.round(rawPos.y * 100) / 100}>  Pos: <${Math.round(pos.x * 100) / 100}, ${Math.round(pos.y * 100) / 100}>`);
        pos = pos.normalize();
        pos.x = pMath.Clamp(pos.x, 0, 1);
        //console.log(`<${pos.x}, ${pos.y}>`);

        let pitch : number = pMath.Clamp(asin(pos.y), -PI * 0.5, PI * 0.5);
        this.rotation = pitch;


        this.glide3(delta, pitch, pos);

        // temp wrap around for testing
        if(1000 < this.x) {
            this.x = 0;
        }
        if (-20 < this.y) {
            this.y = -400;
        }
    }

    private glide3(delta : number, pitch : number, dir : pMath.Vector2) : void {
        let vel : pMath.Vector2 = this.body.velocity; 
        // you need to counteract gravity sin(pitch) needs to be added to your y compontent in the vel vector this
        // should be greater than gravity to move you up if pi/2 > pitch > 0 and move you down.
        // looking down all the way would be all of gravity taking you down and based on the angle you
        // slowly add to gravity until it's positive
        let speedUp : number = (2 * pitch)/PI;
        let mag  : number = vel.length();
        let dot  : number = vel.normalize().dot(dir);

        let nDir = dir.scale(mag + (speedUp * 4));
        this.setVelocity(nDir.x, nDir.y);
        console.log(`SpeedUp: ${Math.round(speedUp * 1000)/1000}  dot: ${Math.round(dot*1000)/1000}   mag ${Math.round(mag*1000)/1000}   nDir: <${Math.round(nDir.x*1000)/1000}, ${Math.round(nDir.y*1000)/1000}>`);
    }
}
