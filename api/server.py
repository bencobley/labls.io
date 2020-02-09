from flask import Flask
from flask import request
from flask_cors import CORS
from gameEngine import GameEngine
import json

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['GET','POST'])
def index():
    user_id = request.args.get('uid')
    game_id = request.args.get('gid')
    request_type = request.args.get('type')

    if request.method == 'POST':
        # For this type of request, information is being passed from frontend
        #       to backend

        type = request.form.get('type')
        team = request.form.get('team')

        if type == "word":
            word = request.form.get('word')
            quantity = request.form.get('quantity')
            # TODO: save word to game state, to be returned in status
        elif type == "selections":
            selectedImageIds = json.loads(request.form.get('selections'))


    else:
        if request_type == "status":
            response = {
                    "data": {
                        "type": "status",
                        "attributes": {
                            "state": game.getStatus(),
                            "teams":
                                [
                                    { "redScore" : game.returnRedScore()},
                                    { "blueScore" : game.returnBlueScore()}

                                ]

                        }
                    }

                }
            return json.dumps(response)

        elif request_type == "images":
            response = {
                "data": {
                    "type" : "images",
                        "attributes" : {
                            "state" : game.getState(),
                            "images" : game.returnImageMap()

                        }
                    }
                }
            return json.dumps(response)



    # type=images&gid=<GAME_ID>&uid=<USER_ID>




    # return request.args.get("user")



game = GameEngine()

app.run()
