/*tic-tac-toe logics to always tie game and display corresponding action 
  in the screen*/
//hold position 1-9, false is not having any mark, type will be either 'cros' (x) or cir (O), icon refers to the html tag corresponding to the square
var box = [
  {'status':false, 'position':0, 'type':'neutral', 'icon':'pos1i'},
  {'status':false, 'position':1, 'type':'neutral', 'icon':'pos2i'},
  {'status':false, 'position':2, 'type':'neutral', 'icon':'pos3i'},
  {'status':false, 'position':3, 'type':'neutral', 'icon':'pos4i'},
  {'status':false, 'position':4, 'type':'neutral', 'icon':'pos5i'},
  {'status':false, 'position':5, 'type':'neutral', 'icon':'pos6i'},
  {'status':false, 'position':6, 'type':'neutral', 'icon':'pos7i'},
  {'status':false, 'position':7, 'type':'neutral', 'icon':'pos8i'},
  {'status':false, 'position':8, 'type':'neutral', 'icon':'pos9i'}
];

//hold moves that player made
var playerMove = [];

//hold moves that computer made!
var computerMove = [];

//hold whether x or o
var playerChoice;
var computer;

//holds state of whether user had chosen to go first
var firstMove = true;

//the move done in turn //notYet or didMove
var makeMove = 'notYet';

//variable holding whether computer goes first or not
var computerFirst;

//notFilled variable is for use in endgame
var notFilled = true;
//secondMove2 variable is for use in activateGame to identify whether player is on their second move
var secondMove2 = true;

//com1stMove shows if it's computer's first move
var com1stMove = true;
//secondMove shows if it's computer's second move
var secondMove = true;

var turnMoved = false;


//user click to choose go first or second, computer gets other choice
$('#goFirst').click(function(){
  chooseTurn(false);
});

$('#goSecond').click(function(){
  chooseTurn(true);
})

//function for use when user choose computer or user goes first
function chooseTurn(computerGoesFirst){
  if(computerGoesFirst){
    computerFirst = true;
  }else{
    computerFirst = false;
  }
  $('#chooseTurn').css('visibility','hidden');
  $('#chooseXO').css('visibility','visible');
}

//if user click X for choice of symbol
$('#chooseX').click(function(){
  chooseXorO('X');
})

//if user click O for choice of symbol
$('#chooseO').click(function(){
  chooseXorO('O');
})

//function user choosing which symbol, and assign accordingly
//hide some elements, and start game with computer move if user had chosen to go second
function chooseXorO(xO) {
  if(xO==='X'){
    playerChoice = 'X';
    computer = 'O'; 
  }else{
    playerChoice = 'O';
    computer = 'X';
  }
  $('#chooseXO').css('visibility','hidden');
  $('table').css('visibility','visible');
  $('#gameButton').css('visibility','visible');
  if(computerFirst){
    computerGoesFirst();
  }
}

//the behaviors that would happen when clicking each box
//when top left square is clicked
$('#pos1').click(function(){
  clickBox(0);
});

$('#pos2').click(function(){
  clickBox(1);
});

$('#pos3').click(function(){
  clickBox(2);
});

//when middle row left square is clicked
$('#pos4').click(function(){
  clickBox(3);
});

$('#pos5').click(function(){
  clickBox(4);
});

$('#pos6').click(function(){
  clickBox(5);
});

//when bottom row left square is clicked
$('#pos7').click(function(){
  clickBox(6);
});

$('#pos8').click(function(){
  clickBox(7);
});

$('#pos9').click(function(){
  clickBox(8);
});

//the behaviors that would happen when clicking each box
function clickBox(arg){
  //check if empty, only allow clicking when empty
  if(box[arg].status===false){
    //playerChoice is global variable depending on what player chose, x or o
    //since only player can click, it will be player choice, and add move to array
    squareAction(arg,playerChoice,'player');
    //if player chose to go second, respond with computerGoesFirst moves
    if(computerFirst){
      computerGoesFirst();
    }
    //if chose to go first, respond with activateGame moves
    else{
      activateGame();
    }
  }
}

//function for activating each square and keeping track of player and computer's move
//boxNum is number for use in box
//xORo. for whether X or O, and display on table accordingly
//comOrPlayer, whether a computer move or player move
function squareAction(boxNum, xORo, comOrPlayer){
  //switch to true in box so know it's marked
  box[boxNum].status = true;
  if(xORo==='O'){
    box[boxNum].type = 'cir';
    if(comOrPlayer==='player'){
      //remember move in playerMove array
      playerMove.push(box[boxNum]);
    }
    else{
      //remember move in computerMove array
      computerMove.push(box[boxNum]);
    }
    //draw O on TTT table in the right box
    $('#'+box[boxNum].icon).addClass('fa fa-circle-o');
  }
  else{
    box[boxNum].type = 'cros';
    if(comOrPlayer==='player'){
      playerMove.push(box[boxNum]);
    }
    else{
      computerMove.push(box[boxNum]);
    }
    //draw X on TTT table in the right box
    $('#'+box[boxNum].icon).addClass('fa fa-times');
  }
}

//function for which moves to do if player goes first
function activateGame(){
  //first move to do as computer being the player went first
  if(firstMove === true){
    firstResponseMove();
    //no longer first move for rest of game
    firstMove = false;
  }
  
  //win move has highest priority except for firstResponseMove
  //which goes away after first move
  //end game after winMove
  if(makeMove==='notYet'){
    winMove();
  }
  
  //prevent player from winning is next priority
  if(makeMove==='notYet'){
    preventMove();
  }
  
  //since goal is to win as computer, secondResponseMove will make dependent
  //choice of player's second move, take out of priority after invoking
  if(secondMove2 && makeMove==='notYet'){
    secondResponseMove();
    secondMove2 = false;
  }
  
  //mark the center square, if it hasn't been marked
  if(makeMove==='notYet'){
    centerMove();
  }
  
  //mark corner if haven't been marked
  if(makeMove==='notYet'){
    cornerMove(false);
  }
  
  //at this point, no winner so filled in remaining empty squares
  if(makeMove==='notYet'){
    tieMove();
  }
  //makeMove resets at end of each iteration of activateGame
  makeMove='notYet';
  //notFilled true means winning move had not occured
  if(notFilled){
    //check if all squares mark yet, if did, and winning move had not occured
    //endGame will show tie message
    endGame('filled');
  }
}

//do the winning move, end game
function winMove(){
  //if statements for each winning condition and mark the winning move
  if(box[0].status===false && computer === 'O' && ((box[1].type==='cir' && box[2].type==='cir')||(box[3].type==='cir' && box[6].type==='cir')|| (box[4].type==='cir' && box[8].type==='cir'))){
    //enter computer choice, and add to computer moves array
    //this box will be the winning move
    squareAction(0, computer, 'computer');
    //if this particular conditions match for winning
    if(box[1].type==='cir' && box[2].type==='cir'){
      //change the color of the three squares to show winning pattern
      changeColor(1, 2, 3);
    }
    else if(box[3].type==='cir' && box[6].type==='cir'){
      changeColor(1, 4, 7);
    }
    else if(box[4].type==='cir' && box[8].type==='cir'){
      changeColor(1, 5, 9);
    }
    winMoveHelperFunction();
  }
  else if(box[0].status===false && computer === 'X' && ((box[1].type==='cros' && box[2].type==='cros')||(box[3].type==='cros' && box[6].type==='cros')|| (box[4].type==='cros' && box[8].type==='cros'))){
    //only difference is computer is playing as X
    squareAction(0, computer, 'computer');
    if(box[1].type==='cros' && box[2].type==='cros'){
      changeColor(1, 2, 3);
    }
    else if(box[3].type==='cros' && box[6].type==='cros'){
      changeColor(1, 4, 7);
    }
    else if(box[4].type==='cros' && box[8].type==='cros'){
      changeColor(1, 5, 9);
    }
    winMoveHelperFunction();
  }
  else if(box[1].status===false && computer === 'O' && ((box[0].type==='cir' && box[2].type==='cir') || (box[4].type==='cir' && box[7].type==='cir'))){
    squareAction(1, computer, 'computer');
    if(box[0].type==='cir' && box[2].type==='cir'){
      changeColor(2,1,3);
    }
    else if(box[4].type==='cir' && box[7].type==='cir'){
      changeColor(2,5,8);
    }
    winMoveHelperFunction();
  }
  else if(box[1].status===false && computer === 'X' && ((box[0].type==='cros' && box[2].type==='cros') || (box[4].type==='cros' && box[7].type==='cros'))){
    squareAction(1,computer, 'computer');
    if(box[0].type==='cros' && box[2].type==='cros'){
      changeColor(2,1,3);
    }
    else if(box[4].type==='cros' && box[7].type==='cros'){
      changeColor(2,5,8);
    }
    winMoveHelperFunction();
  }
  else if(box[2].status===false && computer === 'O' && ((box[0].type==='cir' && box[1].type==='cir')||(box[4].type==='cir' && box[6].type==='cir')|| (box[5].type==='cir' && box[8].type==='cir'))){
    squareAction(2,computer, 'computer');
    if(box[0].type==='cir' && box[1].type==='cir'){
      changeColor(3,1,2);
    }
    else if(box[4].type==='cir' && box[6].type==='cir'){
      changeColor(3,5,7);
    }
    else if(box[5].type==='cir' && box[8].type==='cir'){
      changeColor(3,6,9);
    }
    winMoveHelperFunction();
  }
  else if(box[2].status===false && computer === 'X' && ((box[0].type==='cros' && box[1].type==='cros')||(box[4].type==='cros' && box[6].type==='cros')|| (box[5].type==='cros' && box[8].type==='cros'))){    
    squareAction(2,computer,'computer');
    if(box[0].type==='cros' && box[1].type==='cros'){
      changeColor(3,1,2);
    }
    else if(box[4].type==='cros' && box[6].type==='cros'){
      changeColor(3,5,7);
    }
    else if(box[5].type==='cros' && box[8].type==='cros'){
      changeColor(3,6,9);
    }
    winMoveHelperFunction();
  }
  else if(box[3].status===false && computer === 'O' && ((box[0].type==='cir' && box[6].type==='cir') || (box[4].type==='cir' && box[5].type==='cir'))){
    squareAction(3,computer, 'computer');
    if(box[0].type==='cir' && box[6].type==='cir'){
      changeColor(4,1,7);
    }
    else if(box[4].type==='cir' && box[5].type==='cir'){
      changeColor(4,5,6);
    }
    winMoveHelperFunction();
  }
  else if(box[3].status===false && computer ==='X' && ((box[0].type==='cros' && box[6].type==='cros') || (box[4].type==='cros' && box[5].type==='cros'))){
    squareAction(3,computer, 'computer');
    if(box[0].type==='cros' && box[6].type==='cros'){
      changeColor(4,1,7);
    }
    else if(box[4].type==='cros' && box[5].type==='cros'){
      changeColor(4,5,6);
    }
    winMoveHelperFunction();
  }
  else if(box[4].status===false && computer === 'O' && ((box[0].type==='cir' && box[8].type==='cir') || (box[1].type==='cir' && box[7].type==='cir') || (box[2].type==='cir' && box[6].type==='cir') || (box[3].type==='cir' && box[5].type==='cir'))){
    squareAction(4,computer, 'computer');
    if(box[0].type==='cir' && box[8].type==='cir'){
      changeColor(5,1,9);
    }
    else if(box[1].type==='cir' && box[7].type==='cir'){
      changeColor(5,2,8);
    }
    else if(box[2].type==='cir' && box[6].type==='cir'){
      changeColor(5,3,7);
    }
    else if(box[3].type==='cir' && box[5].type==='cir'){
      changeColor(5,4,6);
    }
    winMoveHelperFunction();
  }
  else if(box[4].status===false && computer === 'X' && ((box[0].type==='cros' && box[8].type==='cros') || (box[1].type==='cros' && box[7].type==='cros') || (box[2].type==='cros' && box[6].type==='cros') || (box[3].type==='cros' && box[5].type==='cros'))){
    squareAction(4,computer, 'computer');
    if(box[0].type==='cros' && box[8].type==='cros'){
      changeColor(5,1,9);
    }
    else if(box[1].type==='cros' && box[7].type==='cros'){
      changeColor(5,2,8);
    }
    else if(box[2].type==='cros' && box[6].type==='cros'){
      changeColor(5,3,7);
    }
    else if(box[3].type==='cros' && box[5].type==='cros'){
      changeColor(5,4,6);
    }
    winMoveHelperFunction();
  }
  else if(box[5].status===false && computer === 'O' && ((box[2].type==='cir' && box[8].type==='cir') || (box[3].type==='cir' && box[4].type==='cir'))){
    squareAction(5,computer, 'computer');
    if(box[2].type==='cir' && box[8].type==='cir'){
      changeColor(6,3,9);
    }
    else if(box[3].type==='cir' && box[4].type==='cir'){
      changeColor(6,4,5);
    }
    winMoveHelperFunction();
  }
  else if(box[5].status===false && computer === 'X' && ((box[2].type==='cros' && box[8].type==='cros') || (box[3].type==='cros' && box[4].type==='cros'))){
    squareAction(5,computer,'computer');
    if(box[2].type==='cros' && box[8].type==='cros'){
      changeColor(6,3,9);
    }
    else if(box[3].type==='cros' && box[4].type==='cros'){
      changeColor(6,4,5);
    }
    winMoveHelperFunction();
  }
  else if(box[6].status===false && computer === 'O' && ((box[0].type==='cir' && box[3].type==='cir')||(box[2].type==='cir' && box[4].type==='cir')|| (box[7].type==='cir' && box[8].type==='cir'))){
    squareAction(6,computer, 'computer');
    if(box[0].type==='cir' && box[3].type==='cir'){
      changeColor(7,1,4);
    }
    else if(box[2].type==='cir' && box[4].type==='cir'){
      changeColor(7,3,5);
    }
    else if(box[7].type==='cir' && box[8].type==='cir'){
      changeColor(7,8,9);
    }
    winMoveHelperFunction();
  }
  else if(box[6].status===false && computer === 'X' && ((box[0].type==='cros' && box[3].type==='cros')||(box[2].type==='cros' && box[4].type==='cros')|| (box[7].type==='cros' && box[8].type==='cros'))){
    squareAction(6,computer,'computer');
    if(box[0].type==='cros' && box[3].type==='cros'){
      changeColor(7,1,4);
    }
    else if(box[2].type==='cros' && box[4].type==='cros'){
      changeColor(7,3,5);
    }
    else if(box[7].type==='cros' && box[8].type==='cros'){
      changeColor(7,8,9);
    }
    winMoveHelperFunction();
  }
  else if(box[7].status===false && computer === 'O' && ((box[1].type==='cir' && box[4].type==='cir') || (box[6].type==='cir' && box[8].type==='cir'))){
    squareAction(7, computer, 'computer');
    if(box[1].type==='cir' && box[4].type==='cir'){
      changeColor(8,2,5);
    }
    else if(box[6].type==='cir' && box[8].type==='cir'){
      changeColor(8,7,9);
    }
    winMoveHelperFunction();
  }
  else if(box[7].status===false && computer === 'X' && ((box[1].type==='cros' && box[4].type==='cros') || (box[6].type==='cros' && box[8].type==='cros'))){
    squareAction(7, computer, 'computer');
    if(box[1].type==='cros' && box[4].type==='cros'){
      changeColor(8,2,5);
    }
    else if(box[6].type==='cros' && box[8].type==='cros'){
      changeColor(8,7,9);
    }
    winMoveHelperFunction();
  }
  else if(box[8].status===false && computer === 'O' && ((box[0].type==='cir' && box[4].type==='cir')||(box[2].type==='cir' && box[5].type==='cir')|| (box[6].type==='cir' && box[7].type==='cir'))){
    squareAction(8, computer, 'computer');
    if(box[0].type==='cir' && box[4].type==='cir'){
      changeColor(9,1,5);
    }
    else if(box[2].type==='cir' && box[5].type==='cir'){
      changeColor(9,3,6);
    }
    else if(box[6].type==='cir' && box[7].type==='cir'){
      changeColor(9,7,8);
    }
    winMoveHelperFunction();
  }
  else if(box[8].status===false && computer === 'X' && ((box[0].type==='cros' && box[4].type==='cros')||(box[2].type==='cros' && box[5].type==='cros')|| (box[6].type==='cros' && box[7].type==='cros'))){
    squareAction(8, computer, 'computer');
    if(box[0].type==='cros' && box[4].type==='cros'){
      changeColor(9,1,5);
    }
    else if(box[2].type==='cros' && box[5].type==='cros'){
      changeColor(9,3,6);
    }
    else if(box[6].type==='cros' && box[7].type==='cros'){
      changeColor(9,7,8);
    }
    winMoveHelperFunction();
  }
}

//helper function for winMove that changes some states and call endGame()
function winMoveHelperFunction(){
  //makeMove value changed for use in activateGame and computerGoesFirst
  makeMove = 'didMove';
  //endGame function to show losing message to player
  endGame('win');
  //change notFilled value so endGame('filled') won't be used
  notFilled = false;    
}


//change color of 3 squares to show the 3 squares of winning patter
function changeColor(num1, num2, num3){
  $('#pos'+num1).css('background-color','lightgreen');
  $('#pos'+num2).css('background-color','lightgreen');
  $('#pos'+num3).css('background-color','lightgreen');
}

//prevent opponent's winning move if player's winning conditions are met
function preventMove(){
  if(box[0].status===false && ((box[1].type==='cir' && box[2].type==='cir')||(box[3].type==='cir' && box[6].type==='cir')|| (box[4].type==='cir' && box[8].type==='cir')))
  {
    squareAction(0, 'X', 'computer');
    makeMove = 'didMove';
    //if player reach winning condition before the second move of computer
    //take secondResponseMove out of priority
    secondMove2 = false;
  }
  else if(box[0].status===false && ((box[1].type==='cros' && box[2].type==='cros')||(box[3].type==='cros' && box[6].type==='cros') || (box[4].type==='cros' && box[8].type==='cros')))
  {
    squareAction(0, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[1].status===false && ((box[0].type==='cir' && box[2].type==='cir') || (box[4].type==='cir' && box[7].type==='cir')))
  {
    squareAction(1, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[1].status===false && ((box[0].type==='cros' && box[2].type==='cros') || (box[4].type==='cros' && box[7].type==='cros')))
  {
    squareAction(1, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[2].status===false && ((box[0].type==='cir' && box[1].type==='cir')||(box[4].type==='cir' && box[6].type==='cir')|| (box[5].type==='cir' && box[8].type==='cir')))
  {
    squareAction(2, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[2].status===false && ((box[0].type==='cros' && box[1].type==='cros')||(box[4].type==='cros' && box[6].type==='cros')|| (box[5].type==='cros' && box[8].type==='cros')))
  {
    squareAction(2, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[3].status===false && ((box[0].type==='cir' && box[6].type==='cir') || (box[4].type==='cir' && box[5].type==='cir')))
  {
    squareAction(3, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[3].status===false && computer === 'O' && ((box[0].type==='cros' && box[6].type==='cros') || (box[4].type==='cros' && box[5].type==='cros')))
  {
    squareAction(3, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[4].status===false && ((box[0].type==='cir' && box[8].type==='cir') || (box[1].type==='cir' && box[7].type==='cir') || (box[2].type==='cir' && box[6].type==='cir') || (box[3].type==='cir' && box[5].type==='cir')))
  {
    squareAction(4, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[4].status===false && ((box[0].type==='cros' && box[8].type==='cros') || (box[1].type==='cros' && box[7].type==='cros') || (box[2].type==='cros' && box[6].type==='cros') || (box[3].type==='cros' && box[5].type==='cros')))
  {
    squareAction(4, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[5].status===false && ((box[2].type==='cir' && box[8].type==='cir') || (box[3].type==='cir' && box[4].type==='cir')))
  {
    squareAction(5, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[5].status===false && ((box[2].type==='cros' && box[8].type==='cros') || (box[3].type==='cros' && box[4].type==='cros')))
  {
    squareAction(5, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[6].status===false && ((box[0].type==='cir' && box[3].type==='cir')||(box[2].type==='cir' && box[4].type==='cir')|| (box[7].type==='cir' && box[8].type==='cir')))
  {
    squareAction(6, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[6].status===false && ((box[0].type==='cros' && box[3].type==='cros')||(box[2].type==='cros' && box[4].type==='cros')|| (box[7].type==='cros' && box[8].type==='cros')))
  {
    squareAction(6, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[7].status===false && ((box[1].type==='cir' && box[4].type==='cir') || (box[6].type==='cir' && box[8].type==='cir')))
  {
    squareAction(7, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[7].status===false && ((box[1].type==='cros' && box[4].type==='cros') || (box[6].type==='cros' && box[8].type==='cros')))
  {
    squareAction(7, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[8].status===false && ((box[0].type==='cir' && box[4].type==='cir')||(box[2].type==='cir' && box[5].type==='cir')|| (box[6].type==='cir' && box[7].type==='cir')))
  {
    squareAction(8, 'X', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
  else if(box[8].status===false && ((box[0].type==='cros' && box[4].type==='cros')||(box[2].type==='cros' && box[5].type==='cros')|| (box[6].type==='cros' && box[7].type==='cros')))
  {
    squareAction(8, 'O', 'computer');
    makeMove = 'didMove';
    secondMove2 = false;
  }
}

//goal is to win/tie atleast if player going first, so respond according to 
//player's first move
function firstResponseMove(){
  //player plays center
  if(playerMove[0].position===4){
    var holdRandom = Math.floor((Math.random() * 4) + 1);
    if(holdRandom === 1){
      squareAction(0, computer, 'computer');
    }
    else if(holdRandom===2){
      squareAction(2, computer, 'computer');
    }
    else if(holdRandom===3){
      squareAction(6, computer, 'computer');
    }
    else{
      squareAction(8, computer, 'computer');
    }
  }
  //player plays edge
  else if(playerMove[0].position===1 || playerMove[0].position===3){
    squareAction(0, computer, 'computer');
  }
  else if(playerMove[0].position===5 || playerMove[0].position===7){
    squareAction(8, computer, 'computer');
  }
  //player plays corner
  else{
    centerMove();
  }
  makeMove = 'didMove';
}

//goal is to win/tie atleast if player going first, so respond according to 
//player's second move
function secondResponseMove(){
  if((playerMove[1].position===0 || playerMove[1].position===2 || playerMove[1].position===6 || playerMove[1].position===8) && (computerMove[0].position===4)){
    var holdRandom = Math.floor(Math.random()*4);
    var edgeList = [1,3,5,7];
    squareAction(edgeList[holdRandom],computer, 'computer');
    makeMove='didMove';
  }
  else if((playerMove[1].position===1 || playerMove[1].position===3 || playerMove[1].position===5 || playerMove[1].position===7) && (computerMove[0].position===4)){
    if(playerMove[1].position===1){
      if(box[0].status===false){
        squareAction(0,computer,'computer');
      }
      else{
        squareAction(2,computer,'computer');
      }
       makeMove='didMove';
    }
    else if(playerMove[1].position===3){
      if(box[0].status===false){
        squareAction(0,computer,'computer');
      }
      else{
        squareAction(6,computer,'computer');
      }
       makeMove='didMove';
    }
    else if(playerMove[1].position===5){
      if(box[2].status===false){
        squareAction(2, computer, 'computer');
      }
      else{
        squareAction(8, computer, 'computer');
      }
       makeMove='didMove';
    }
    else if(playerMove[1].position===7){
      if(box[6].status===false){
        squareAction(6, computer, 'computer');
      }
      else{
        squareAction(8, computer, 'computer');
      }
       makeMove='didMove';
    }
  }
}

//mark center square
function centerMove(){
  if(box[4].status===false){
    squareAction(4, computer, 'computer');
    makeMove = 'didMove';
  }
}

//mark corner squares, two uses, if random then fill in a random corner
//if not random, fill in the top left corner first if empty, going clockwise until find 
//empty
function cornerMove(random){
  if(random){
    var listRandom =[0,2,6,8];
    var holdRandom = Math.floor((Math.random() * 4));
    squareAction(listRandom[holdRandom], computer, 'computer');
    makeMove = 'didMove';
    
  }
  else{
    if(box[0].status===false){
      squareAction(0, computer, 'computer');
      makeMove = 'didMove';
    }
    else if(box[2].status===false){
      squareAction(2, computer, 'computer');
      makeMove = 'didMove';
    }
    else if(box[6].status===false){
      squareAction(6, computer, 'computer');
      makeMove = 'didMove';
    }
    else if(box[8].status===false){
      squareAction(8, computer, 'computer');
      makeMove = 'didMove';
    }
  }
}

//filled in the remaining empty squares, starting with the lowest position square
//used as lowest priority
function tieMove(){
  for(var i = 0; i<9; i++){
    if(box[i].status===false){
      squareAction(i, computer, 'computer');
      makeMove = 'didMove';
      return;
    }
  }
}

//computer goes first, the first move that computer do
function computerFirstMove(){
  cornerMove(true);
}

//goal is to win/tie with computer going first, so respond according to player's first move
function computerSecondMove(){
  if(playerMove[0].position===1||playerMove[0].position===3||playerMove[0].position===5||playerMove[0].position===7){
    centerMove();
  }
  else if(playerMove[0].position===0 ||playerMove[0].position===2||playerMove[0].position===6||playerMove[0].position===8){
    cornerMove(false);
  }
  else if(playerMove[0].position===4){
    if(computerMove[0].position===0){
      squareAction(8, computer, 'computer');
    }
    else if(computerMove[0].position===2){
      squareAction(6, computer, 'computer');
    }
    else if(computerMove[0].position===6){
      squareAction(2, computer, 'computer');
    }
    else if(computerMove[0].position===8){
      squareAction(0, computer, 'computer');
    }
  }
  makeMove='didMove';
}

//function for which moves to do if computer goes first, similiar to activateGame
function computerGoesFirst(){
  if(com1stMove){
    computerFirstMove();
    com1stMove = false;
  }
  
  if(makeMove==='notYet'){
    winMove();
  }
  
  if(makeMove==='notYet'){
    preventMove();
  }
  
  if(secondMove && makeMove==='notYet'){
    computerSecondMove()
    secondMove = false;
  }
  
  if(makeMove==='notYet'){
    centerMove();
  }
  
  if(makeMove==='notYet'){
    cornerMove(false);
  }
  
  if(makeMove==='notYet'){
    tieMove();
  }
  
  if(notFilled){
    endGame('filled');
  }
  makeMove='notYet';  
}

//start a new game with the same choices the player had chosen
function newGame(){
  //hide game message
  $('#gameMessage').css('visibility','hidden');
  //default global variables
  playerMove = [];
  computerMove = [];
  firstMove = true;
  makeMove = 'notYet';
  com1stMove = true;
  secondMove = true;
  turnMoved = false;
  secondMove2 = true;
  notFilled = true;
  //clear the marking on the table
  for(var z = 0;z<9;z++){
    box[z].status = false;
    box[z].type = 'neutral';
    var x = z + 1;
    $('#pos'+x).css('background-color','white');
    if($('#pos'+x+'i').hasClass('fa fa-circle-o')){
      $('#pos'+x+'i').removeClass('fa fa-circle-o');
    }
    else{
      $('#pos'+x+'i').removeClass('fa fa-times');
    }
  }
  //invoke computerGoesFirst if player had chose to go second
  if(computerFirst){
    computerGoesFirst();
  }
}

//click new game button to start new game
$('#newGame').click(newGame);

//end the game by displaying end game message
//if parameter is 'filled', check if all squares are mark, if so display tie message
//if parameter is 'win', meant used in winning condition, display player lose message
function endGame(endStatus){
  if(endStatus==='filled'){
    var allFill = true;
    //check if all squares are marked
    for(var c = 0; c < 9; c++){
      if(box[c].status===false){
        allFill = false;
      }
    }
    if(allFill){
      //show tie message and start new game after a bit
      $('#gameMessage').text('It\'s a tie');
      $('#gameMessage').css('visibility','visible');
      setTimeout(function(){newGame()}, 1800);
    }
  }
  else if(endStatus==='win'){
    //display the winning message and start new game
    $('#gameMessage').text('You lose');
    $('#gameMessage').css('visibility','visible');
    setTimeout(function(){newGame()}, 1000);
  }
}

//click reset game button to reset game
$('#resetGame').click(resetGame);

//reset the game allowing player to choose choie of symbol and turn choice
function resetGame(){
  //hide all elements except for choose turn message
  $('table').css('visibility','hidden');
  $('#chooseXO').css('visibility','hidden');
  $('#gameButton').css('visibility','hidden');
  $('#gameMessage').css('visibility','hidden');
  $('#chooseTurn').css('visibility','visible');
  //reset player choices 
  playerChoice = '';
  computer = '';
  computerFirst = '';
  newGame();
}

//start the game
resetGame();