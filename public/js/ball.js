export default class Ball{
    width = 40;
    height = 40;
    left = 0;
    top = 0;
    radius = 0;

    speedX = 4;
    speedY = 4;

    color = 'blue';

    constructor(left, top, color){
        this.left = left;
        this.top = top;
        this.color = color;
    } 
}