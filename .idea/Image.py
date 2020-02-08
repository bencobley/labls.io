class Image:
    def __init__(self, url, id, selected, colour):
        self.name = name
        self.url = url
        self.selected = selected
        self.colour = colour

    def getName(self):
        return self.name

    def getUrl(self):
        return self.url

    def getSelected(self):
        return self.selected

    def getColour(self):
        return self.colour

    def isBomb(self):
        return self.colour == Colour.BLACK
