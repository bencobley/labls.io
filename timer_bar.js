var i = 0;

function startTimerBar() {
    if (i == 0) {
        i = 1;
        var elem = document.getElementById("progress-bar");
        var width = 1;
        var id = setInterval(frame, 10);

        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width += 0.1;
                elem.style.width = width + "%";
            }
        }
    }
}