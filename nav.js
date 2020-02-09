

$(document).ready(function() {
  $('.start-hidden').hide();
  showBoardSelect();
});


function showIntro() {
  $('.intro').show();
}

function showLoading() {
 $('.loading').show();
}

function showBoardWord() {
 $('.board-word').show();
}

function showBoardSelect() {
  $('.board-select').show();
}

function showResultRound() {
  $('.result-round').show();

}

function showResultGame () {
  $('.result-game').show();
  document.getElementById("score").style.fontSize = "48px";

}