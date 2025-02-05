import { MenuScene } from './scenes/Menu';
import { PlayScene } from './scenes/Play';

export const GameConfig : Phaser.Types.Core.GameConfig = {
    title: 'Endless Runner',
    url: 'https://github.com/Spebby/Endless-Runner',
    version: '0.0.1',
    backgroundColor: 0x3a404d,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.MAX_ZOOM,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        parent: 'game',
        width:  750,
        height: 750
    },
    physics: {
        default: 'matter',
        matter: {
            enabled: true,
            debug: true,
            gravity: { x: 0, y: 100 }
        }
    },
    scene: [MenuScene, PlayScene],
    input: {
        keyboard: true
    },
    render: { pixelArt: true }
};

export const UIConfig : { borderUISize: number, borderPadding: number } = {
    borderUISize:   (parseInt(GameConfig.scale.height as string) || window.innerHeight) / 15,
    borderPadding: ((parseInt(GameConfig.scale.height as string) || window.innerHeight) / 15) / 3
};
