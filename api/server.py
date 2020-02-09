from flask import Flask
from flask import request
from flask_cors import CORS
from gameEngine import GameEngine
import json

app = Flask(__name__)
CORS(app)


@app.route('/api', methods=['GET', 'POST'])
def index():
    request_type = request.args.get('type')

    print("chosen: ", game.redChosen, game.blueChosen, game.getState())


    if request.method == 'POST':
        # For this type of request, information is being passed from frontend
        #       to backend

        type = request.form.get('type')
        team = request.form.get('team')

        print ("POST TYPE: ", type)

        if type == "word":
            word = request.form.get('word')
            quantity = request.form.get('quantity')
            if team == "blue":
                game.setBlueWordChoice(word, quantity)
                game.blueGuessed()
            else:
                game.setRedWordChoice(word, quantity)
                game.redGuessed()

            print("team::: ", request.form.get('team'))
            if game.redChosen and game.blueChosen:
                game.setState("BOARD-SELECT")

        elif type == "selections":
            selectedImages = json.loads(request.form.get('selections'))
            if team == "red":
                game.setRedGuesses(selectedImages)
            else:
                game.setBlueGuesses(selectedImages)

            if game.haveBothChosenImages():
                if game.roundNo >= game.totalRounds:
                    game.setState("RESULT-GAME")
                else:
                    game.setState("RESULT-ROUND")

        return '{"success": "true"}'


    else:

        team = request.args.get('team')

        if request_type == "status":
            attributes = {
                "attributes": {
                    "state": game.getState(),
                    "teams":
                        [
                            {"redScore": game.returnRedScore()},
                            {"redRoundScore": game.getRedRoundScore()},
                            {"blueScore": game.returnBlueScore()},
                            {"blueRoundScore": game.getBlueRoundScore()}
                        ]
                }
            }

            if game.getState() == "BOARD-SELECT":
                if team == "red":
                    newAttributes = attributes.get("attributes")
                    newAttributes.update({"word": game.getRedWord(), "quantity": game.getRedQuantity()})
                    attributes.update({"attributes": newAttributes})
                else:
                    newAttributes = attributes.get("attributes")
                    newAttributes.update({"word": game.getBlueWord(), "quantity": game.getBlueQuantity()})
                    attributes.update({"attributes": newAttributes})


            response = {
             "data": {
                    "type": "status",
                    "attributes": attributes

             }
            }

            return json.dumps(response)


        elif request_type == "images":
            response = {
                "data": {
                    "type": "images",
                    "attributes": {
                        "state": game.getState(),
                        "images": game.returnImageMap()

                    }
                }
            }
            return json.dumps(response)

    # type=images&gid=<GAME_ID>&uid=<USER_ID>

    # return request.args.get("user")


game = GameEngine()

app.run()
game.setState("LOADING")
