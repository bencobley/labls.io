"use strict";

/*************** Application variables *****************/

var endpoint_url = 'http://192.168.0.73:5000/';
var update_interval = 1000;

/*******************************************************/

var __game;


function formGetUrl(endpoint, data) {
  var url = endpoint + '?';
  Object.keys(data).forEach(key => {
    url += key + "=" + data[key] + "&";
  });
  return (url.charAt(url.length - 1) == "&" ?
    url.substring(0, url.length - 2) : url);
}





function log(data) {
  console.log(data);
}

function getStatus(game) {
  console.log("Getting status.");
  $.ajax({
      type: 'GET',
      url: "frontend/data/status_BOARD-WORD.json", // formGetUrl(endpoint_url, data),
      success: function(data) {
        game.update(data, game)
      },
      error: function(data) {
        throw "Error: failed to get status. ";
      }
  });
}

// ).done(function( data ) {
//     console.log('done');
//     game.update(data);
// });

$(document).ready(function() {
  showIntro();
  __game = new Game('2398732', '23342', 'PLAYER');

  setInterval(getStatus, update_interval, __game);

});


class Game {

  constructor(user_id, team_id, player_role) {
    this.user_id = user_id;
    this.team_id = team_id;
    this.player_role = player_role;   // "CAPTAIN" or "PLAYER"
    this.current_state = "";
    this.current_round_word = "";
    this.max_player_selections = 0;
    this.board = new Board();
  }


  update(data) {

    data = data.data;

    if (this.current_state == data.attributes.state) {
      // no change in state: no need to update
      return;
    }

    switch(data.type) {
      case "status":
        // debugger;
        if (data.attributes.state == "INTRO") {
          this.toState("INTRO");
        } else if (data.attributes.state == "LOADING") {
          this.toState("LOADING");
        } else if (data.attributes.state == "BOARD-WORD") {
          this.toState("BOARD-WORD");
        } else if (data.attributes.state == "BOARD-SELECT") {
          // game word must be sent in 'data'
          this.current_round_word = data.attributes.word;
          // TODO: remove magic no
          this.max_player_selections = 3;

        }
        break;

      default:
        throw "Error: unrecognized status. "
    }
  }


  toState(stateCode) {
    this.current_state = stateCode;

    switch(stateCode) {
      case "INTRO":
        showIntro();
        break;
      case "LOADING":
        showLoading();
        break;
      case "BOARD-WORD":
        this.board.retrieveImages();
        showBoardWord();
        if (this.player_role == "CAPTAIN") {
          // TODO: allow captain to select a word
          // TODO: set timer
        } else {
          // TODO: player must wait while captain selects a word
        }

        break;
      case "BOARD-SELECT":
        showBoardSelect();
        if (this.player_role == "PLAYER") {
          // TODO: allow player to select images
          // TODO: set maximum number of images to select
          this.current_round_max_no_images = 3;
          // TODO: set timer
        } else {
          // TODO: captain must wait while player selects images
        }
        break;

      case "RESULT-ROUND":
        showResultRound();

      case "RESULT-GAME":
        showResultGame();

      default:
        throw "Invalid Status Code";
      }
  }


}


class Board {

  constructor() {
    this.images = [];
  }

  retrieveImages() {
    $.ajax({
        type: 'GET',
        url: "frontend/data/images.json", // formGetUrl(endpoint_url, data),
        success: this.updateBoard,
        error: function() {alert('error')}
    });
  }

  updateBoard(images) {
    images = images.data.attributes.images;
    this.images = new Images();

    for (var i = 0; i < images.length; i++) {
      this.images.add(
        new Image(images[i], i, images[i].url, images[i].owner, this.images))
    }

  }


}


class Image {
  constructor(id, index, url, owner, parentArray) {
    var self = this;
    this.id = id;
    this.index = index;
    this.selected = false;
    this.owner = owner;
    this.parentArray = parentArray;
    this.wrapperObject = $('#image-wrapper-' + index);
    this.imageObject = $('#image-' + index);
    // remove any existing classes associated with image and add class
    //    representing team owning image
    this.imageObject.removeClass().addClass("image-" + owner);
    // update src of image
    this.imageObject.attr("src", url);

    this.wrapperObject.on("click", function() {
      debugger;
      if (__game.player_role == "PLAYER") {
        if (self.parentArray.countSelected() < __game.max_player_selections) {
          self.imageObject.addClass('show-border');
          self.selected = true;
        }
      }
    });
  }


}


class Images {
  constructor() {
    this.images = []
  }

  add(image) {
    this.images.push(image);
  }

  countSelected() {
    return this.countSelected.length;

  }

  getSelected() {
    var selected = [];
    for (var i = 0; i < this.images.length; i++) {
      if (this.images[i].selected) {
        selected.push(this.images[i]);
      }
    }
    return selected;

  }

}




// ********* nav.js *************


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


$('.lobby-submit').click(function() {showBoardSelect()});
