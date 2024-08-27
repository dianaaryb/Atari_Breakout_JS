
export default class UI{
    // real screen dimensions
    width = -1;
    height = -1;

    brain = null;
    appContainer = null;
    startButton = null;
    pauseButton = null;
    resumeButton = null;
    textUnderStartButton = null;
    isPaused = false;

    scaleX = 1;
    scaleY = 1;

    scoresList = [];
    scores = [];
    

    constructor(brain, appContainer){
        this.brain = brain;
        this.appContainer = appContainer;
        this.setScreenDimensions();
    }

    setScreenDimensions(width, height){ // if given width is undefined or incorrect, then it takes numebr on the right
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;
    }

    calculateScaledX(x){
        return x * this.scaleX | 0; //| 0 -teisendab taiskoha arvuks; bittwice
    }

    calculateScaledY(y){
        return y * this.scaleY | 0;
    }

    calculateScaledRadius(radius){
        return radius * Math.min(this.scaleX, this.scaleY) | 0;
    }

    drawRectangle(left, top, width, height, color, radius){
        let border = document.createElement('div');
        
        border.style.zIndex = 10;
        border.style.position = 'fixed';

        border.style.left = left + 'px'; // x
        border.style.top = top + 'px'; // y
        
        border.style.width = width + 'px'; 
        border.style.height = height + 'px'; 
        border.style.backgroundColor = color;

        this.appContainer.append(border);
        return border;
    }

    drawBorder(){
        //top border
        this.drawRectangle(0,0,this.width,this.calculateScaledY(this.brain.borderThickness),'purple');
        //left border
        this.drawRectangle(0,0,this.calculateScaledX(this.brain.borderThickness), this.height, 'purple');
        //right
        this.drawRectangle(this.width - this.calculateScaledX(this.brain.borderThickness), 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'purple');
        this.drawRectangle(0, this.height - this.calculateScaledY(this.brain.borderThickness), this.width, this.calculateScaledY(this.brain.borderThickness), 'purple');
    }

    drawBottomPaddle(){
        this.drawRectangle(this.calculateScaledX(this.brain.bottomPaddle.left), this.calculateScaledY(this.brain.bottomPaddle.top), 
            this.calculateScaledX(this.brain.bottomPaddle.width), this.calculateScaledY(this.brain.bottomPaddle.height), 'black');
    }

    drawBricks(){
        for (const line of this.brain.arrayRows) {
            for (const brick of line) {
                let brickElement = this.drawRectangle(this.calculateScaledX(brick.left), this.calculateScaledY(brick.top), 
                    this.calculateScaledX(brick.width), this.calculateScaledY(brick.height), brick.color);
                
                    let number = document.createElement('div');
                    number.textContent = brick.number;
                    number.style.color = 'black';
                    number.style.position = 'absolute';
                    number.style.width = '100%';
                    number.style.height = '100%';
                    number.style.display = 'flex';
                    number.style.justifyContent = 'center';
                    number.style.alignItems = 'center';
                    
                    const baseFontSize = 30;
                    const fontSizeScalingFactor = Math.min(this.scaleX, this.scaleY);

                    const scaledFontSize = baseFontSize * fontSizeScalingFactor;
                    number.style.fontSize = scaledFontSize + 'px';

                    brickElement.appendChild(number);
                }
        } 
    }    

    drawBall1(left, top, width, height, color){
        let circle = document.createElement('div');
        
        circle.style.zIndex = 10;
        circle.style.position = 'fixed';

        circle.style.left = left + 'px'; // x
        circle.style.top = top + 'px'; // y
        
        circle.style.width = width + 'px'; 
        circle.style.height = height + 'px'; 
        circle.style.backgroundColor = color;

        circle.style.borderRadius = 50 + '%';

        this.appContainer.append(circle);
    }

    drawBall(){
        this.drawBall1(this.calculateScaledX(this.brain.ball.left), 
                        this.calculateScaledY(this.brain.ball.top), 
                        this.calculateScaledX(this.brain.ball.width), 
                        this.calculateScaledX(this.brain.ball.width),
                        this.brain.ball.color);
    }

    drawStartButton(){
        this.startButton = document.createElement('button');
        this.startButton.style.cursor = 'pointer';
        this.startButton.textContent = "START GAME";
        this.startButton.style.backgroundColor = 'green';
        this.startButton.style.position = 'absolute';
        this.startButton.style.display = 'flex';
        this.startButton.style.top = '40%';
        this.startButton.style.left = '50%';
        this.startButton.style.transform = 'translate(-50%, -50%)';

        const baseFontSize = 50;
        const fontSizeScalingFactor = Math.min(this.scaleX, this.scaleY);

        const scaledFontSize = baseFontSize * fontSizeScalingFactor;
        this.startButton.style.fontSize = scaledFontSize + 'px';

        this.appContainer.appendChild(this.startButton);
        return this.startButton;
    }

    drawTextUnderStartButton(){
        this.textUnderStartButton = document.createElement('div');
        this.textUnderStartButton.textContent = "BEST RESULTS";
        this.textUnderStartButton.style.position = 'absolute';
        this.textUnderStartButton.style.top = '50%';
        this.textUnderStartButton.style.left = '50%';
        this.textUnderStartButton.style.transform = 'translate(-50%, -50%)';

        const baseFontSize = 30;
        const fontSizeScalingFactor = Math.min(this.scaleX, this.scaleY);

        const scaledFontSize = baseFontSize * fontSizeScalingFactor;
        this.textUnderStartButton.style.fontSize = scaledFontSize + 'px';

        this.appContainer.appendChild(this.textUnderStartButton);
        return this.textUnderStartButton;
    }

    displayListOfScores(){
        this.scores = this.brain.getScores();
        this.scoresList = document.createElement('ul');

         // Convert scores object to an array of [nickname, score] pairs, sort it by score in descending order, and slice the top 5
        const sortedScores = Object.entries(this.scores).sort((a, b) => b[1] - a[1]).slice(0, 5); 
        //by subtracting b[1] from a[1]. If the result is negative, a is sorted before b. If positive, b is sorted before a. If zero, their order remains unchanged.

        for(const [nickname, score] of sortedScores){
            const listItem = document.createElement('li');
            listItem.textContent = nickname + ': ' + score;
            this.scoresList.appendChild(listItem);
        }

        this.scoresList.style.position = 'absolute';
        this.scoresList.style.top = '50%';
        this.scoresList.style.left = '40%';

        const baseFontSize = 30;
        const fontSizeScalingFactor = Math.min(this.scaleX, this.scaleY);

        const scaledFontSize = baseFontSize * fontSizeScalingFactor;
        this.scoresList.style.fontSize = scaledFontSize + 'px';

        this.appContainer.appendChild(this.scoresList);
    }

    drawScore(){
        let scoreDiv = document.createElement('div');

        scoreDiv.textContent = this.brain.nickname + "'s score: " + this.brain.score;
        scoreDiv.style.position = 'absolute';
        scoreDiv.style.top = '5%';
        scoreDiv.style.left = '45%';

        const baseFontSize = 40;
        const fontSizeScalingFactor = Math.min(this.scaleX, this.scaleY);

        const scaledFontSize = baseFontSize * fontSizeScalingFactor;
        scoreDiv.style.fontSize = scaledFontSize + 'px';

        this.appContainer.appendChild(scoreDiv);
    }

    drawPauseButton(){
        this.pauseButton = document.createElement('button');
        this.pauseButton.style.cursor = 'pointer';
        this.pauseButton.textContent = "PAUSE";
        this.pauseButton.style.backgroundColor = 'pink';
        this.pauseButton.style.position = 'absolute';
        this.pauseButton.style.display = 'flex';
        this.pauseButton.style.top = '5%';
        this.pauseButton.style.left = '75%';

        const baseFontSize = 30;
        const fontSizeScalingFactor = Math.min(this.scaleX, this.scaleY);

        const scaledFontSize = baseFontSize * fontSizeScalingFactor;
        this.pauseButton.style.fontSize = scaledFontSize + 'px';

        this.appContainer.appendChild(this.pauseButton);
        return this.pauseButton;
    }

    drawResumeButton(){
        this.resumeButton = document.createElement('button');
        this.resumeButton.style.cursor = 'pointer';
        this.resumeButton.textContent = "RESUME";
        this.resumeButton.style.backgroundColor = 'pink';
        this.resumeButton.style.position = 'absolute';
        this.resumeButton.style.display = 'flex';
        this.resumeButton.style.top = '5%';
        this.resumeButton.style.left = '85%';

        const baseFontSize = 30;
        const fontSizeScalingFactor = Math.min(this.scaleX, this.scaleY);

        const scaledFontSize = baseFontSize * fontSizeScalingFactor;
        this.resumeButton.style.fontSize = scaledFontSize + 'px';

        this.appContainer.appendChild(this.resumeButton);
        return this.resumeButton;
    }

    draw(){
        if(!this.isPaused){
        // clear previous render
            this.appContainer.innerHTML = ''; //tühistab appContainer
            this.setScreenDimensions();
            this.drawPauseButton();
            this.drawResumeButton();
            this.drawBorder();
            this.drawBottomPaddle();
            this.drawBricks();
            this.drawScore();
            this.drawBall();
        }else{
            console.log("Game is paused")
        }
    }
}
