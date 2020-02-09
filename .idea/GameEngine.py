
class GameEngine:
    def __init__(self):
        self.currentState = "INTRO"
        self.redScore = 0
        self.redRoundScore = 0
        self.blueRoundScore = 0
        self.blueScore = 0
        self.redLost = False
        self.blueLost = False


    def play(self):
        round = 0
        NUMBER_OF_ROUNDS = 3
        while(round < NUMBER_OF_ROUNDS):
            self.playRound()
            if self.redLost or self.blueLost:
                break
            round += 1
            self.currentState = "ROUND_RESULT"
            #passes through redRoundScore and blueRoundScore to server
        self.currentState = "GAME_RESULT"
        self.returnResults()#send scores to server


    def returnResults(self):
        if redLost == True and blueLost == True:
           #return draw to server
           pass
        elif redLost == True:
            #red hit a bomb, return blues points and red loses
            pass
        elif blueLost == True:
            #same as above, define other method and pass in team
            pass
        else:
            # return scores of both teams
            pass


    def playRound(self):
        photos = self.generateImages()
        redPhotos = photos[:4]
        bluePhotos = photos[4:7]
        blackPhoto = photos[-1]
        self.currentState = "CAPTAIN"
        #send photos to server
        #recieve captain choices
        redChoice = ["CHANGE THIS", 0]
        blueChoice = ["CHANGE THIS", 0]
        # Send word to server
        self.currentState = "PLAYER"
        # receive player choices
        redGuess = ["2", "4" ,"7"]
        blueGuess = ["1", "2", "3"] #GET THESE FROM THE SERVER
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
            self.redScore += redRoundScore
            self.blueScore += otherTeam
        elif team == Colour.BLUE:
            self.blueLost = bomb
            self.redScore += otherTeam
            self.blueRoundScore = currentTeam
            self.blueScore += blueRoundScore


    def generateImages(self):
        return ["1", "2", "3", "4", "5", "6", "7", "8"]










