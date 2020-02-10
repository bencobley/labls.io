

$(document).ready(function() {
  showResultRound();
});


function showIntro() {
  $('.start-hidden').hide();
  $('.intro').show();
}

function showLoading() {
  $('.start-hidden').hide();
  $('.loading').show();
}

function showBoardWord() {
  $('.start-hidden').hide();
  $('.board-word').show();
}

function showBoardSelect() {
  $('.start-hidden').hide();
  $('.board-select').show();
}

function showResultRound() {
  $('.start-hidden').hide();
  $('.result-round').show();

}

function showResultGame () {
  $('.start-hidden').hide();
  $('.result-game').show();
  document.getElementById("score").style.fontSize = "48px";

}


$('.lobby-submit').click(function() {showBoardWord()});


