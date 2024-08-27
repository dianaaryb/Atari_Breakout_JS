import Brain from "./brain.js";
import UI from "./ui.js";


export default class UserInputHandler{
    brain = null;
    ui = null;

    constructor(ui, brain){
        this.brain = brain;
        this.ui = ui;
    }
    
    resizeStartPage(){
        window.addEventListener('resize', (e) => {
            this.ui.drawStartButton();
        });
    }

    resizeGamePage(){
        window.addEventListener('resize', (e) => {
            this.ui.draw();
        });
    }

    moveBottomPaddleWithArrows(){ 
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft': 
                    this.brain.movePaddle(this.brain.bottomPaddle, -1);
                    break;
                case 'ArrowRight':
                    this.brain.movePaddle(this.brain.bottomPaddle, 1);
                    break;
            }
            this.ui.draw();
        });
    }

    pauseResumeGame(){
        let pauseButton = this.ui.drawPauseButton();
        let resumeButton = this.ui.drawResumeButton();

        pauseButton.addEventListener('click', () => {
            this.ui.isPaused = true;
        });
        
        resumeButton.addEventListener('click', () => {
            this.ui.isPaused = false;
            this.uiDrawRepeater(this.ui); 
        });
    }

    uiDrawRepeater(ui) {
        if(!this.brain.isGameOver){
            if(!ui.isPaused){
                requestAnimationFrame(() => {
                this.brain.moveBall();
                ui.draw();
                this.pauseResumeGame();
                this.uiDrawRepeater(ui);
            });
         }
        }else{
            alert("Game Over!");
        }
    }
}
