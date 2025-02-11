/**
 * @author Thom Mott
 * @title Fly-By
 * ~33 hours of development time
 *
 * Creative Tilt:
 * For mechanics, a decently advanced physics routine, and cookie/saving support.
 * For visuals, I think the art is pretty nice and decently creative, and fits the gameplay well :). I've also never seen an endless runner that's more focused on quick and snappy vertical movement. It just occurred to me while writing that Jetpack Joyride does exist, but I think the design philosophies are pretty different.
 */


import 'phaser';
import { GameConfig } from './config';

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener('load', () => {
    const game = new Game(GameConfig);
});
