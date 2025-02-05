declare global {
    // vars
    let highScore : number;


    // consts
    let assetPath : string;
}

export let gVar = {
    highScore : 0,
}

export let gConst = {
    assetPath : process.env.NODE_ENV === 'production' ? './assets/' : '../assets',
} as const;
