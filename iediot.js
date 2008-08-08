function runBelow(){
  var url = document.getElementById('test-url').value;
  if(url != null && url.length > 0){
    if( url.indexOf("?") > 0){
      url += "&nocache=" + Math.random();
    }else{
      url += "?nocache=" + Math.random();
    }

    window.frames[0].location.href = url;
    var load = document.getElementById("last-load");
    load.innerHTML = new Date();
  }
}

var controller = {
  numberOfSecondsChanged: function(){
    reload();
  }
};

var Layout = Class.create({
  staticPanelWidth: -1,
  getStaticPanelWidth: function(){
    if( this.staticPanelWidth == -1 ){
      this.staticPanelWidth = $('test-url-label').getWidth() +
      $('number-seconds').getWidth() +
      $('pause-play-button').getWidth();
    }
    return this.staticPanelWidth;
  },
  handleResize: function(){
    var width = document.viewport.getWidth();
    $('iediot-panel-background').style.width = width; //$('iediot-panel').getWidth() + "px";
    $('iediot-panel-background').style.height = $('iediot-panel').cumulativeOffset()[1] + $('iediot-panel').getHeight() + "px";
    $('iediot-panel-background').setAttribute('width', width);
    $('iediot-panel-background').height = $('iediot-panel').cumulativeOffset()[1] + $('iediot-panel').getHeight();
    initBackground('iediot-panel-background');

    var urlInputRightEdge = this.getStaticPanelWidth() + $('test-url').getWidth();
    this.shrink($('test-url'), (width - this.getStaticPanelWidth()) - 150);

  },
  shrink: function(input, size){
    var lastWidth = 0;
    while(input.getWidth() < size &&
          lastWidth != input.getWidth()){
      lastWidth = input.getWidth();
      input.style.width = (input.getWidth() + 20) + "px";
    }

    lastWidth = 0;
    while(input.getWidth() > size &&
          //input.size > 10 &&
          (! isNaN(parseInt(input.style.width))) &&
          parseInt(input.style.width) > 10 &&
          lastWidth != input.getWidth()){
      input.style.width = (input.getWidth() - 2) + "px";
    }
  }
});
var layout = new Layout();

function initBackground(id){
  if( $(id) && $(id).getContext ){
    var ctx = $(id).getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, $(id).getHeight());

    gradient.addColorStop(0, "rgb(200, 200, 200)");
    gradient.addColorStop(1, "rgb(150, 150, 150)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, $(id).getWidth(), $(id).getHeight());
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 1;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    ctx.strokeRect(1, 1, $(id).getWidth() -2, $(id).getHeight() -2);
  }
}

Event.observe(window, 'resize', layout.handleResize.bindAsEventListener(layout));
Event.observe(window, 'load', function(){
  initBackground('iediot-panel-background');
  layout.handleResize();
  $('test-url').value = unescape( window.location.hash.substring(1) );
  $('test-url').focus();
  $('test-url').select();
  Event.observe($('load-above'), 'click', function(){
    window.location.href =   $('test-url').value;
  });
  Event.observe($('pause-play-button'), 'click', function(el){
    pausePlay(el);
  });
  Event.observe($('number-seconds'), 'change', function(el){
    controller.numberOfSecondsChanged();
  });
  Event.observe($('test-url'), 'change', function(el){
    controller.numberOfSecondsChanged();
  });
  reload();
});

var currentTimout;
function reload(){
  if( currentTimout ){
    clearTimeout( currentTimout );
  }
  
  if( ! paused ){
    var number_of_seconds = 
           parseInt(document.getElementById('number-seconds').value);
    if( ! isNaN( number_of_seconds ) && 
          number_of_seconds > 0 ){
      //User wants page reloaded
      runBelow();
      currentTimout = window.setTimeout( reload, number_of_seconds * 1000);
    }
  }
}

var paused = false;
function pausePlay(button){
  if(window.console) console.info(button);
  if(paused){
    $('test-url').style.backgroundColor = "white";
    $('number-seconds').style.backgroundColor = "white";
    button.innerHTML = "Pause";
    paused = false;
  }else{
    $('test-url').style.backgroundColor = "#DDD";
    $('number-seconds').style.backgroundColor = "#DDD";
    button.innerHTML = "Resume";
    paused = true;
  }
  reload();
}
