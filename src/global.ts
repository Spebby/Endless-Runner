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
    menuConfig : {
        fontFamily: 'Chillen',
        fontSize: '32px',
        //backgroundColor: '#F3B141',
        color: '#FFFFFF',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
        },
        fixedWidth: 0
    }
} as const;
