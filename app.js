import { String } from "./string.js";

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

        this.NumString = 50;
        this.strings = [];

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();
        
        window.requestAnimationFrame(this.animate.bind(this));
    }
    
    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
        
        this.gap = this.stageHeight / this.NumString;
        for(let i=0; i<this.NumString; i++) {
            this.strings[i] = new String(0, this.gap * i, this.stageWidth, this.gap * i);
        }

        for(let i=0; i<this.NumString; i++) {
            this.strings[i].resize(this.stageWidth, this.stageHeight);
        }
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));

        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        
        for(let i=0; i<this.NumString; i++) {
            this.strings[i].animate(this.ctx);
        }
    }
}

window.onload = () => {
    new App();
}