"use strict";

/*************** Application variables *****************/

var endpoint_url = ' http://127.0.0.1:5000/api';
var update_interval = 1000;

/*******************************************************/

var __game;


function formGetUrl(endpoint, data) {
  var url = endpoint + '?';
  Object.keys(data).forEach(key => {
    url += key + "=" + data[key] + "&";
  });
  return (url.charAt(url.length - 1) == "&" ?
    url.substring(0, url.length - 1) : url);
}





function log(data) {
  console.log(data);
}

function getStatus(game) {
  console.log("Getting status.", formGetUrl(endpoint_url, {team: __game.team_id, type: "status"}));
  $.ajax({
      type: 'GET',
      url:  formGetUrl(endpoint_url, {team: __game.team_id, type: "status"}),
      success: function(data) {
        game.update(data, game)
      },
      error: function(data) {
        throw "Error: failed to get status. ";
      }
  });
}

function postToAPI(data) {
  console.log("Posting to " + endpoint_url, data);
  $.ajax({
      type: 'POST',
      url: endpoint_url,
      data: data,
      success: function(response) {console.log(response)},
  });

}




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
    data = JSON.parse(data).data;

    if (this.current_state == data.attributes.state) {
      // no change in state: no need to update
      return;
    }

    switch(data.type) {
      case "status":
        console.log("state: ", data.attributes.state)
        if (data.attributes.state == "INTRO") {
          this.toState("INTRO");
        } else if (data.attributes.state == "LOADING") {
          this.toState("LOADING");
        } else if (data.attributes.state == "BOARD-WORD") {
          this.toState("BOARD-WORD");
        } else if (data.attributes.attributes.state == "BOARD-SELECT") {
          // game word and quantity must be sent in 'data'
          this.current_round_word = data.attributes.attributes.word;
          this.max_player_selections = parseInt(data.attributes.attributes.quantity);
          this.toState("BOARD-SELECT");
        } else if (data.attributes.state == "RESULT-ROUND") {
          this.toState("RESULT-ROUND");
        } else if (data.attributes.state == "RESULT-GAME") {
          this.toState("RESULT-GAME");
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
        showBoardWord(this.player_role);
        // TODO: set timer

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
        url: formGetUrl(endpoint_url, {team: __game.team_id, type: "images"}),
        success: this.updateBoard,
        error: function() {alert('error')}
    });
  }

  updateBoard(images) {

    images = JSON.parse(images).data.attributes.images;
    this.images = new Images();

    for (var i = 0; i < images.length; i++) {
      this.images.add(
        new Image(images[i].id, i, images[i].url, images[i].owner, this.images))
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
    if (__game.player_role == "CAPTAIN") {
      $('.image-wrapper img').addClass('show-border')
    }
    // update src of image
    this.imageObject.attr("src", url);

    this.wrapperObject.on("click", function() {
      if (__game.player_role == "PLAYER") {
        if (self.parentArray.countSelected() < __game.max_player_selections) {
          self.imageObject.addClass('show-border');
          self.selected = true;
        }
        var count = self.parentArray.countSelected()
        if (count >= __game.max_player_selections && count > 0) {
          var selectedImages = self.parentArray.getSelected();
          var selectedImageIDs = [];
          for (var i = 0; i < selectedImages.length; i++) {
            selectedImageIDs.push(selectedImages[i].id);
          }
          postToAPI({
            type: "selections",
            selections: JSON.stringify(selectedImageIDs)
          })
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
    return this.getSelected().length;

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

function showBoardWord(player_role) {
  $('.start-hidden').hide();
  $('.board-word').show();
  $('.board-word-' + player_role).show();

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


$(document).ready(function() {
  showIntro();

  var team = new URLSearchParams(window.location.search).get('team');
  var role = new URLSearchParams(window.location.search).get('role');

  // BEN DO IT HERE

  if (team == "red") {
    $('.team-text').css("color", "#D62839");
    $('.team-text').html("Red team");
    $('#progress-bar').css("background-color", "#D62839");
  }

  if (team == "blue") {
    $('.team-text').css("color", "#0D4C80");
    $('.team-text').html("Blue team");
    $('#progress-bar').css("background-color", "#0D4C80");
  }

  __game = new Game('2398732', team, role);

  $('.lobby-submit').click(function() {
    __game.toState("BOARD-WORD");
  });
  $('#submit-word-1').click(function() {
    postToAPI({team: __game.team_id, type: "word", word: $('#word-input').val(), quantity: 1})
  });
  $('#submit-word-2').click(function() {
    postToAPI({team: __game.team_id, type: "word", word: $('#word-input').val(), quantity: 2})
  });
  $('#submit-word-3').click(function() {
    postToAPI({team: __game.team_id, type: "word", word: $('#word-input').val(), quantity: 3})
  });

  setInterval(getStatus, update_interval, __game);

});
