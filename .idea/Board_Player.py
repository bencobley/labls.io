class Board_Player(Board):
    def __init__(self, name, player, team):
        super.__init__(name)
        self.player = player
        self.team = team


    def assignImages(self, images):
        team.setSelectedImages(images)



