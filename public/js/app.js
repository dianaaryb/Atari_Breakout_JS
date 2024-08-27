import Brain from "./brain.js";
import UI from "./ui.js";
import UserInputHandler from "./userInputHandler.js";


function validateIndexHtml(){
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
}

    function main() {
        validateIndexHtml();
        let appDiv = document.querySelector("#app"); // votab querySelectorAll ja vptab sealt esimene element
        let brain = new Brain();
        let ui = new UI(brain, appDiv);
        let userInputHandler = new UserInputHandler(ui, brain);
        
        userInputHandler.resizeStartPage();
        ui.drawTextUnderStartButton();
        ui.displayListOfScores();

        let startButton = ui.drawStartButton();
  
        startButton.addEventListener('click', () => {
            startButton.style.display = 'none';
            brain.nickname = prompt('Enter your nickname');
            if(brain.nickname){
                userInputHandler.resizeGamePage();
                userInputHandler.pauseResumeGame();
                userInputHandler.moveBottomPaddleWithArrows();
                if(!ui.isPaused){
                    userInputHandler.uiDrawRepeater(ui);
                }
            }
        });
}


// ==================================ENTRY POINT============================
main();