var ticTacToe = function(element, options) {

    // declare variables (positions are indexes on the board)
    var playerPositions = [],
        computerPositions = [],
        freePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8],
        winners = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]],
        
        turn = "player",
        gameComplete = false,
        winner = null,
        message = "";        
        
    // get options or set defaults
    var options = options || {} ;
    options.ai = options.ai || "smart";
    options.firstTurn = options.firstTurn || "random";
    
    // create DOM elements
    var DOM_board = quickCreateElement("div", "board"),
        DOM_gameMessage = quickCreateElement("div", "message"),  
        DOM_squares = [ ];
    for (var i=0; i<9; i++) {
        DOM_squares.push(quickCreateElement("div", "square", "square" + i));
    }   
    
    // organise DOM elements: add 9 squares to board    
    for (var i=0; i<9; i++) {
        DOM_board.appendChild(DOM_squares[i]);
    }      
    
    // HELPER FUNCTIONS
    
    // function to quick create a DOM element with certain type, class, id
    function quickCreateElement(type, cls, id) {
        var ret = document.createElement(type);
        if (cls) { ret.classList.add(cls); }
        if (id) { ret.id = id; }
        return ret
    }
    
    // function to check if an array contains an element
    function contains(arr, el) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == el) { return true }
        }
        return false
    };

    // function to see if array of board positions occupied contains a winner
    function containsWinner(arr) {
        for (var i=0; i<winners.length; i++) {
            // if some winning combination's 3 positions are contained in arr
            if (winners[i].filter(x => contains(arr,x)).length === 3) {
                return true
            }
        }
        return false
    }

    // PROCESS FUNCTIONS
    
    function reset () {
        // good way to remove all children (credit SO)
        while (element.lastChild) {
            element.removeChild(element.firstChild);
        }
    };
    
    function loadInitialDOM() {    
        element.appendChild(DOM_board);
        element.appendChild(DOM_gameMessage);
    };
    
    // evaluate board to see if there's a winner
    function evaluate () {
        if (containsWinner(playerPositions)) {
            gameComplete = true;
            winner = "player";
        }
        else if (containsWinner(computerPositions)) {
            gameComplete = true;
            winner = "computer";
        }
        else if (freePositions.length === 0){
            gameComplete = true;
            winner = "tie";
        }
        // else do nothing and continue
    }
    
    function computerRandomChoice() {
        var indexChoice = Math.floor(Math.random() * freePositions.length);
        // the splice returns an array of 1 element
        var positionChoice = freePositions.splice(indexChoice, 1)[0];
        return positionChoice
    }
    
    function computerSmartChoice() {
        // first see if there is a winning option
        for (var i=0; i<freePositions.length; i++) {
            // make duplicate array of computer positions and add a free position, see if 
            // that produces a winner
            var testArray = computerPositions.slice()
            testArray.push(freePositions[i]);
            if (containsWinner(testArray)) {
                // splice to return the correct position and also remove it from freePositions
                return freePositions.splice(i,1)
            }
        }
        // then see if there is a loss-preventing option
        for (var i=0; i<freePositions.length; i++) {
            // make duplicate array of player positions and add a free position, see if 
            // that produces a winner
            var testArray = playerPositions.slice()
            testArray.push(freePositions[i]);
            console.log(testArray);
            if (containsWinner(testArray)) {
                // splice to return the correct position and also remove it from freePositions
                return freePositions.splice(i,1)
            }
        }
        // if neither, then just play randomly
        return computerRandomChoice()
    }
    
    // TODO: improve AI further
    function computerMove() {
        
        if (options.ai === "random") {
            var positionChoice = computerRandomChoice();
        }
        else if (options.ai === "smart") {
            var positionChoice = computerSmartChoice();
        }
        
        // process the move and continue (position is removed from freePositions already)
        computerPositions.push(positionChoice);
        DOM_squares[positionChoice].innerHTML = "O";
        turn = "player";
    };
    
    // onclick function for each square
    function playerMove () {
        removePlayerMoveListeners(freePositions);
        // event.target.id is e.g. "square1"
        var positionChoice = + event.target.id[6];
        var index = freePositions.indexOf(positionChoice);
        // this splice returns an array of 1 element
        var positionChoice = freePositions.splice(index, 1)[0];
        DOM_squares[positionChoice].innerHTML = "X";
        playerPositions.push(positionChoice);
        
        evaluate();
        turn = "computer";
        continueGame();
    };
    
    function showHover () {
        // also add class? for additional styling
        this.innerHTML = "X";
    }
    
    function hideHover () {
        this.innerHTML = "";
    }
    
    // add event listeners for hovering and clicking for certain squares
    function addPlayerMoveListeners(positions) {
        for (var i=0; i<positions.length; i++) {
            var square = DOM_squares[positions[i]];
            square.classList.add("clickable");
            square.addEventListener("mouseover", showHover);
            square.addEventListener("mouseout", hideHover);
            square.addEventListener("click", playerMove);
        }
    }
    
    function removePlayerMoveListeners(positions) {
        for (var i=0; i<positions.length; i++){
            var square = DOM_squares[positions[i]];
            square.classList.remove("clickable");
            square.removeEventListener("mouseover", showHover);
            square.removeEventListener("mouseout", hideHover);
            square.removeEventListener("click", playerMove);
        }
    }
    
    function displayGameMessage() {
        if (winner === "player") {
            message = "congrats, you win!";
        }
        else if (winner === "computer") {
            message = "you lose!";
        } 
        else {
            message = "tie!";
        }
        DOM_gameMessage.innerHTML = message;
    }
    
    function continueGame () {
        if (gameComplete) {
            displayGameMessage();
        }
        else if (turn === "player") {
            addPlayerMoveListeners(freePositions);
        }
        else if (turn === "computer"){
            computerMove();
            evaluate();
            continueGame();   
        } 
    }
    
    // START GAME
    reset();
    loadInitialDOM();
    // getFirstTurn()
    continueGame();

};




