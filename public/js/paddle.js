export default class Paddle {
    width = 151;
    height = 30;
    left = 0;
    top = 0;

    color = 'blue';
    number = 0;

    constructor(left, top, color, number) {
        this.left = left;
        this.top = top;
        this.color = color;
        this.number = number
    }
}