export function Board() {

  this.images = []

  this.getImages = function() {
    $.ajax({
        type: 'GET',
        url: "data/images.json", // formGetUrl(endpoint_url, data),
        success: updateBoard
    });
  }

  this.updateBoard = function(images) {
    this.images = JSON.parse(images);

    for (var i = 0; i < this.images.length; i++) {
      $('#image-' + i).attr("src", this.images[i].url);
      $('#image-' + i).removeClass().addClass("image-" + this.images[i].owner);
    }
  }


}
