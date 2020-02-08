class Board(State):

    def __init__(self, name, images):
        super.__init__(name)
        self.images = images

    def getName(self):
        return self.name

    def getImages(self):
        return self.images



