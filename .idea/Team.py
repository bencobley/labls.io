class Team:

    def __init__(self, name, players, designatedImages):
        self.name = name
        self.players = players
        self.designatedImages = designatedImages
        self.result = 0;


    def getPlayers(self):
        return self.players

    def getDesignatedImages(self):
        return self.designatedImages

    def getSelectedImages(self):
        return self.selectedImages

    def setSelectedImages(self, images):
        self.selectedImages = images

    def hasBomb(self):
        for image in self.selectedImages:
            if image.getColour == Colour.BLACK:
                return True
        else:
            return False

    def updateResult(self, value):
        self.result += value



