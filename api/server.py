from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['GET','POST'])
def index():

    return "hello" + request.args.get('user')


if __name__ == '__main__':
    app.run()

