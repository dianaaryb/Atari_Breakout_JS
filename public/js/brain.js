import Paddle from "./paddle.js";
import Ball from "./ball.js";

export default class Brain {
    width = 1000;
    height = 1000;
    borderThickness = 30;
    paddleSpacing = 5;
    paddle = new Paddle();
   
    arrayRows = [];
    bottomPaddle = null;
    ball = null;
    nickname = "Player"; 

    isGameOver = false;
    score = 0;

    mapResults = new Map();

    constructor(){
        this.createPaddles();
        this.createBottomPaddle();
        this.createBall();
    }

    createBottomPaddle(){
        this.bottomPaddle = new Paddle(this.width / 2 - 105, this.height - 3 * this.borderThickness, 'black');
    }

    createPaddles(){
        let colors = ['red', 'green', 'red', 'green', 'red', 'green'];
        let numbers = [6, 5, 4, 3, 2, 1];
        let yPosition = this.borderThickness + 10 * this.paddleSpacing + this.paddle.height;
        for(let row = 0; row < 6; row++){
            let arrayLines = [];
            for (let column = 0; column < 6; column++) {
                let xPos = this.borderThickness + this.paddleSpacing + (this.paddle.width + this.paddleSpacing) * column;
                let paddle = new Paddle(xPos, yPosition, colors[row], numbers[row]);
                arrayLines.push(paddle);
            }
            yPosition += this.paddle.height + this.paddleSpacing;
            this.arrayRows.push(arrayLines);
        } 
    }

    movePaddle(paddle, step) {
        const newLeft = paddle.left + step * 40;
        if (newLeft >= this.borderThickness && (newLeft + paddle.width) <= (this.width - this.borderThickness)) {
            paddle.left = newLeft;
        }
    }

    createBall(){
        this.ball = new Ball(this.width / 2 - 20, this.height - 5 * this.borderThickness, 'blue', Math.min(this.width, this.height));
    }

    moveBall() {
        if(this.ball.top + this.ball.speedY < this.borderThickness){
            this.ball.speedY = -this.ball.speedY;
        }else if(this.ball.top + this.ball.height + this.ball.speedY > this.height 
            - this.borderThickness - 2 * this.bottomPaddle.height){
            if(this.ball.left + this.ball.width > this.bottomPaddle.left && 
            this.ball.left < this.bottomPaddle.left + this.bottomPaddle.width) {
            this.ball.speedY = -this.ball.speedY;
            }else{ 
            this.isGameOver = true;
            }
        }
        if(this.ball.left + this.ball.speedX - this.borderThickness < 0 || this.ball.left + this.ball.width + this.ball.speedX > 
            this.width - this.borderThickness){
                this.ball.speedX = -this.ball.speedX;
        }
        this.addingNumbersToBricks();
        this.ball.left += this.ball.speedX;
        this.ball.top += this.ball.speedY;
    }

    addingNumbersToBricks() {
        for (let rowIndex = 0; rowIndex < this.arrayRows.length; rowIndex++) {
            const row = this.arrayRows[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const brick = row[colIndex];
                if (this.ball.left + this.ball.width + this.ball.speedX > brick.left &&
                    this.ball.left + this.ball.speedX < brick.left + brick.width &&
                    this.ball.top + this.ball.speedY < brick.top + brick.height &&
                    this.ball.top + this.ball.height + this.ball.speedY > brick.top) {
                    {
                        brick.number -= 1;
                        this.score += 1;
                        this.saveScore(this.nickname, this.score);
                        // localStorage.setItem(this.nickname, this.score);
                        // console.log("Local storage " + localStorage.getItem(this.nickname));
                        // // console.log(this.nickname + ' :' + this.score);
                        // // for (const [key, value] of this.mapResults.entries()) {
                        // //     console.log(key, value);
                        // // }
                        this.ball.speedY = -this.ball.speedY;
                        if (brick.number <= 0) {
                            row.splice(colIndex, 1);
                            this.score += 5;
                            colIndex--;
                            if(this.arrayRows.length == 0 && row.length == 0){
                                alert("Game over! You win!")
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    saveScore(nickname, score){
        // Attempt to retrieve the existing scores object from localStorage
        const scoreStr = localStorage.getItem('scores');
        let scores = scoreStr ? JSON.parse(scoreStr) : {};
        scores[nickname] = score; // Update the scores object with the new score
        localStorage.setItem('scores', JSON.stringify(scores)); // Serialize the updated scores object back into a string
        // and save it to localStorage
    }

    getScores(){
        const scoresStr = localStorage.getItem('scores'); // Retrieve the scores string from localStorage
        const scores = scoresStr ? JSON.parse(scoresStr) : {}; // Parse it into an object if it exists, or default to an empty object
        return scores;
    }
}
