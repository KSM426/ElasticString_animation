import { Point } from "./point.js";
import { disLP, footOfPerpendicular, subtract, add, scalar } from "./lineAndPoint.js"


const pointNum = 4;
const PI2 = Math.PI * 2;

export class String {
    constructor(SX, SY, EX, EY) {
        this.start = new Point(SX, SY, 0, 0);
        this.end = new Point(EX, EY, 0, 0);
        this.center = new Point((SX + EX) / 2, (SY + EY) / 2, 0, 0);
        this.down = new Point();
        this.touch = new Point();
        this.top = new Point();

        this.distance = 20;
        this.loss = 0.8;
        this.points = [];

        document.addEventListener('pointerdown', this.onDown.bind(this));
        document.addEventListener('pointermove', this.onMove.bind(this));
        document.addEventListener('pointerup', this.onUp.bind(this));
    }

    resize(w, h) {
        this.stageWidth = w;
        this.stageHeight = h;

        this.pointDisX = Math.abs(this.start.x - this.end.x) / pointNum;
        this.pointDisY = Math.abs(this.start.y - this.end.y) / pointNum;

        this.points[0] = this.start;
        for(let i=1 ; i<pointNum; i++) {
            this.points[i] = new Point(this.start.x + this.pointDisX * i, this.start.y + this.pointDisY * i, 0, 0);
        }
        this.points[pointNum] = this.end;
    }
    
    animate(ctx) { 
        if(this.mouse && disLP(this.start, this.end, this.mouse) < this.distance && this.mouse.x > this.start.x && this.mouse.x < this.end.x) {
            if(this.isDown && this.flag == 0) this.flag = 1;
        } else {
            this.flag = 0;
        }
        
        if(this.flag == 1) {
            this.distance = 100;
            this.touch = footOfPerpendicular(this.start, this.end, this.mouse);
            this.down = this.mouse;
            this.flag = 2;
        } else if(this.flag == 0) {
            this.distance = 20;
        }

        if(this.flag == 2) {
            this.top = add(this.touch, subtract(this.mouse, this.down));

            if(this.mouse.x > this.start.x && this.mouse.x < this.end.x) {
                this.gradient = ctx.createLinearGradient(this.start.x, this.start.y, this.end.x, this.end.y);
                this.gradient.addColorStop(0, 'rgba(255, 30, 0)');
                this.gradient.addColorStop(this.top.x / this.end.x - this.start.x, 'rgba(255, 255, 0)');
                this.gradient.addColorStop(1, 'rgba(255, 30, 0)');
                ctx.strokeStyle = this.gradient;
            }


            for(let i=1; i<pointNum; i++) {
                if(this.points[i].xi < this.touch.xi) {
                    var pointi =  add(this.points[0], scalar((this.points[i].xi - this.points[0].xi) / (this.touch.xi - this.points[0].xi), subtract(this.top, this.points[0])));
                    this.points[i].x = pointi.x;
                    this.points[i].y = pointi.y;
                } else {
                    var pointi =  subtract(this.points[pointNum], scalar((this.points[pointNum].xi - this.points[i].xi) / (this.points[pointNum].xi - this.touch.xi), subtract(this.points[pointNum], this.top)));
                    this.points[i].x = pointi.x;
                    this.points[i].y = pointi.y;
                }
                this.points[i].vx = this.points[i].xi - this.points[i].x;
                this.points[i].vy = this.points[i].yi - this.points[i].y;
                this.top.vx = this.top.xi - this.top.x;
                this.top.vy = this.top.yi - this.top.y;
            }
        } else {
            if(this.flag == 0) ctx.strokeStyle = 'rgba(255, 30, 0)';

            for(let i=1; i<pointNum; i++) {
                this.points[i].vx *= this.loss;
                this.points[i].vx += this.points[i].xi - this.points[i].x; // f = kx = ma / v += a
                this.points[i].x += this.points[i].vx;
                this.points[i].vy *= this.loss;
                this.points[i].vy += this.points[i].yi - this.points[i].y;
                this.points[i].y += this.points[i].vy;
            }
            if(this.top) {
                this.top.vx *= this.loss;
                this.top.vx += this.touch.xi - this.top.x;
                this.top.x += this.top.vx;
                this.top.vy *= this.loss;
                this.top.vy += this.touch.yi - this.top.y;
                this.top.y += this.top.vy;
            }
        }
        
        let prev = this.points[0];

        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);

        for(let i=1; i<=pointNum; i++) {
            const c = scalar(0.5, add(prev, this.points[i]));

            ctx.quadraticCurveTo(prev.x, prev.y, c.x, c.y);

            prev = this.points[i];
        }
        ctx.lineTo(prev.x, prev.y);
        ctx.stroke();
    }

    onDown(e) {
        this.mouse = new Point(e.clientX, e.clientY);
        this.isDown = true;
    }
    
    onMove(e) {
        this.mouse = new Point(e.clientX, e.clientY);
    }

    onUp(e) {
        this.mouse = new Point(e.clientX, e.clientY);
        this.isDown = false;
        this.flag = 0;
    }
}