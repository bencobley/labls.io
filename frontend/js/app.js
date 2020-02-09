"use strict";

/*************** Application variables *****************/

var endpoint_url = 'http://192.168.0.73:5000/';
var update_interval = 500;


/*******************************************************/


function formGetUrl(endpoint, data) {
  var url = endpoint + '?';
  Object.keys(data).forEach(key => {
    url += key + "=" + data[key] + "&";
  });
  return (url.charAt(url.length - 1) == "&" ?
    url.substring(0, url.length - 2) : url);
}



function showIntro() {}
function getImages() {}


function getStatus(data, callback) {
  $.ajax({
      type: 'GET',
      url: "data/status_BOARD-WORD.json", // formGetUrl(endpoint_url, data),
      success: callback
  });
}


// Refresh page
// setInterval(getStatus, update_interval);


// getStatus({a : "aaa", b : "bbb"})
// formGetUrl(endpoint_url, {a : "aaa", b : "bbb"})

$(document).ready(function() {
  var game = new Game();
});


function Game(user_id, team_id, player_role) {
  this.user_id = user_id;
  this.team_id = team_id;
  this.player_role = player_role;   // "CAPTAIN" or "PLAYER"
  this.current_state = "";
  this.current_round_word = "";
  this.board = new Board();

  this.toState = function(stateCode) {
    this.current_state = stateCode;

    switch(stateCode) {
      case "INTRO":
        this.showIntro();
        break;
      case "LOADING":
        this.showLoading();
        break;
      case "BOARD-WORD":
        this.board.getImages();
        if (this.player_role == "CAPTAIN") {
          // TODO: allow captain to select a word
          // TODO: set timer
        } else {
          // TODO: player must wait while captain selects a word
        }

        break;
      case "BOARD-SELECT":
        if (this.player_role == "PLAYER") {
          // TODO: allow player to select images
          // TODO: set timer
        } else {
          // TODO: captain must wait while player selects images
        }
        break;

      default:
        throw "Invalid Status Code";
      }
  }


  this.update = function(data) {

    if (this.current_state == data.attributes.state) {
      // no change in state: no need to update
      return;
    }

    switch(data.type) {
      case "status":
        if (data.attributes.state == "INTRO") {
          toState("INTRO");
        } else if (data.attributes.state == "LOADING") {
          toState("LOADING");
        } else if (data.attributes.state == "BOARD-WORD") {
          toState("BOARD-WORD");
        } else if (data.attributes.state == "BOARD-SELECT") {
          // game word must be sent in 'data'
          this.current_round_word = data.attributes.word;


        }
        break;

      default:
        throw "Error: unrecognized status. "
    }
  }

  this.showIntro = function() {}
  this.showLoading = function() {}


}


function Board() {

  this.images = []

  this.getImages = function() {
    $.ajax({
        type: 'GET',
        url: "data/images.json", // formGetUrl(endpoint_url, data),
        success: this.updateBoard
    });
  }

  this.updateBoard = function(images) {
    // debugger;
    this.images = images.data.attributes.images;

    for (var i = 0; i < this.images.length; i++) {
      // debugger;
      $('#image-' + i).attr("src", this.images[i].url);
      $('#image-' + i).removeClass().addClass("image-" + this.images[i].owner);
    }
  }


}
