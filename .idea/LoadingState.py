class LoadingState(State):

    def __init__(self, name):
        super.__init__("Loading_State")

    def run(self):
        return "Loading"