import time


class GameEngine:
    def __init__(self):
        self.currentState = "INTRO"
        self.redScore = 0
        self.redRoundScore = 0
        self.blueRoundScore = 0
        self.blueScore = 0
        self.redLost = False
        self.blueLost = False
        self.redWordChoice = "CHANGE THIS"
        self.blueWordChoice = "CHANGE THIS"
        self.redNumberChoice = 0
        self.blueNumberChoice = 0
        self.currentPhotos = []
        self.redGuess = []
        self.blueGuess = []
        self.redChosen = False
        self.blueChosen = False


    def play(self):
        self.currentState = "LOADING"
        round = 0
        NUMBER_OF_ROUNDS = 3
        while round < NUMBER_OF_ROUNDS:
            self.playRound()
            if self.redLost or self.blueLost:
                break
            round += 1
            self.currentState = "RESULT-ROUND"
            # passes through redRoundScore and blueRoundScore to server
        self.returnResults()  # get result and create json thing here to send
        self.currentState = "RESULT-GAME"



    def playRound(self):
        self.redChosen = False
        self.blueChosen = False
        photos = self.generateImages()
        self.currentPhotos = photos
        redPhotos = photos[:4]
        bluePhotos = photos[4:7]
        blackPhoto = photos[-1]
        self.currentState = "BOARD-WORD"
        while self.currentState == "BOARD-WORD":
            time.sleep(0.5)
        self.calculateScore(self.redGuess, redPhotos, blackPhoto, "red")
        self.calculateScore(self.blueGuess, bluePhotos, blackPhoto, "blue")

    def calculateScore(self, guesses, teamphotos, blackphoto, team):
        currentTeam = 0
        otherTeam = 0
        bomb = False
        if guesses.count(blackphoto) == 1:
            bomb = True
        else:
            for guess in guesses:
                if teamphotos.count(guess) > 0:
                    currentTeam += 1
                else:
                    otherTeam += 1
        if team == "red":
            self.redLost = bomb
            self.redRoundScore = currentTeam
            self.redScore += self.redRoundScore
            self.blueScore += otherTeam
        elif team == "blue":
            self.blueLost = bomb
            self.redScore += otherTeam
            self.blueRoundScore = currentTeam
            self.blueScore += self.blueRoundScore

    def generateImages(self):
        # method should randomly select 8 images from database
        return ["1", "2", "3", "4", "5", "6", "7", "8"]

    def setRedWordChoice(self, word, number):
        self.redWordChoice = word
        self.redNumberChoice = number

    def setBlueWordChoice(self, word, number):
        self.blueWordChoice = word
        self.blueNumberChoice = number

    def setRedGuesses(self, words):
        self.redGuesses = words

    def setBlueGuesses(self, words):
        self.blueGuesses = words

    def getState(self):
        return self.currentState

    def getRedWord(self):
        return self.redWordChoice

    def getBlueWord(self):
        return self.blueWordChoice

    def returnRedScore(self):
        return self.redScore

    def returnBlueScore(self):
        return self.blueScore

    def returnImageMap(self):

        imageMap = [{
            "url" : self.currentPhotos[0],
            "owner" : "red"
        },
            {
                "url" : self.currentPhotos[1],
                "owner" : "red"
            },

            {
                "url" : self.currentPhotos[2],
                "owner" : "red"
            },
            {
                "url" : self.currentPhotos[3],
                "owner" : "red"
            },
            {
                "url" : self.currentPhotos[4],
                "owner" : "blue"
            },
            {
                "url" : self.currentPhotos[5],
                "owner" : "blue"
            },
            {
                "url" : self.currentPhotos[6],
                "owner" : "blue"
            },
            {
                "url" : self.currentPhotos[7],
                "owner" : "black"
            },

        ]
        return imageMap

    def setState(self, state):
        self.currentState = state

    def blueGuessed(self):
        self.blueChosen = True

    def redGuessed(self):
        self.redChosen = True


    def getBlueQuantity(self):
        return self.blueNumberChoice

    def getRedQuantity(self):
        return self.redNumberChoice

    def getRedRoundScore(self):
        return self.redRoundScore

    def getBlueRoundScore(self):
        return self.blueRoundScore
