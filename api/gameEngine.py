from Colour import Colour


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


    def play(self):
        round = 0
        NUMBER_OF_ROUNDS = 3
        while round < NUMBER_OF_ROUNDS:
            self.playRound()
            if self.redLost or self.blueLost:
                break
            round += 1
            self.currentState = "ROUND_RESULT"
            # passes through redRoundScore and blueRoundScore to server
        self.returnResults()  # get result and create json thing here to send
        self.currentState = "GAME_RESULT"

    def returnResults(self):
        if self.redLost == True and self.blueLost == True:
            # return draw to server
            pass
        elif self.redLost == True:
            # red hit a bomb, return blues points and red loses
            pass
        elif self.blueLost == True:
            # same as above, define other method and pass in team
            pass
        else:
            # return scores of both teams
            pass

    def playRound(self):
        photos = self.generateImages()
        self.currentPhotos = photos
        redPhotos = photos[:4]
        bluePhotos = photos[4:7]
        blackPhoto = photos[-1]
        self.currentState = "CAPTAIN"
        # send photos to server
        # recieve captain choices

        # Send word to server
        self.currentState = "PLAYER"
        # receive player choices
        redGuess = ["2", "4", "7"]
        blueGuess = ["1", "2", "3"]  # GET THESE FROM THE SERVER
        self.calculateScore(redGuess, redPhotos, blackPhoto, Colour.RED)
        self.calculateScore(bluePhotos, bluePhotos, blackPhoto, Colour.BLUE)

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
        if team == Colour.RED:
            self.redLost = bomb
            self.redRoundScore = currentTeam
            self.redScore += self.redRoundScore
            self.blueScore += otherTeam
        elif team == Colour.BLUE:
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

    def getStatus(self):
        return self.currentState

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

