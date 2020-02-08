"use strict";

import { Board } from './board.js';

export function Game(user_id, team_id, player_role) {
  this.user_id = user_id;
  this.team_id = team_id;
  this.player_role = player_role;   // "CAPTAIN" or "PLAYER"
  this.current_state = "";
  this.current_round_word = "";
  this.board = Board();

  this.toState = function(stateCode) {
    this.current_state = stateCode;

    switch(stateCode) {
      case "STATUS":
        this.showIntro();
        break;
      case "LOADING":
        this.showLoading();
        break;
      case "BOARD-WORD":
        board.getImages();
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
