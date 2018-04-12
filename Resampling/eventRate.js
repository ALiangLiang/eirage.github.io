var points = [];
var coalescedPoints = [];
var eventCount = 0;
var startTime;
var canvas;
var frameCounter;
var colorCounter = 0;
const colors = ["rgba(255, 0, 0, 0.5)", "rgba(255, 128, 0, 0.5)", "rgba(255, 255, 0, 0.5)", "rgba(128, 255, 0, 0.5)",
                "rgba(0, 255, 0, 0.5)", "rgba(0, 255, 128, 0.5)", "rgba(0, 255, 255, 0.5)", " rgba(0, 128, 255, 0.5)",
                "rgba(0, 0, 255, 0.5)", "rgba(128, 0, 255, 0.5)", "rgba(255, 0, 255, 0.5)", "rgba(255, 0, 128, 0.5)"]

function GetContext() {
  return document.getElementById("canvas").getContext("2d"); 
}   

window.addEventListener('resize', function(e) {
    InitializeCanvas();
});

function drawPoints(points, isCoalesced) {
  var context = canvas.getContext('2d');
  for (var i = 0; i < points.length; ++i) {
    var radius = isCoalesced ? 2.0 : 4.0;

    context.beginPath();

    context.arc(points[i].x * scale, points[i].y * scale, radius * scale, 0, 2 * 3.14159, false);
    context.closePath();
    if (isCoalesced)
       context.fillStyle = colors[colorCounter];
    else
       context.fillStyle = colors[colorCounter = (colorCounter + 1) % 12];
    context.fill();
  }
}

function onFrame()
{
  frameCounter++;
  if (!startTime || frameCounter % parseInt(document.getElementById('throttle').value) == 0) {
    drawPoints(points, false);
    drawPoints(coalescedPoints, true);
    points = [];
    coalescedPoints = [];

    var extraWork = parseInt(document.getElementById('work').value);
    if (extraWork > 0) {
      var start = Date.now();
      while(Date.now() - start < extraWork) {
        ;
      }
    }
  }

  if (startTime)
    window.requestAnimationFrame(onFrame);
}

function startDraw()
{
  startTime = performance.now();
  eventCount = 0;
  frameCounter = 0;
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  window.requestAnimationFrame(onFrame);
}

function endDraw()
{
  var duration = performance.now() - startTime;
  var rate = Math.round(eventCount / duration * 1000);
  document.getElementById('rate').textContent = rate;
  startTime = undefined;
}

function addCoalescedPoint(x, y)
{
  coalescedPoints.push({x:x, y:y});
}

function addPoint(x, y)
{
  eventCount++;
  points.push({x:x, y:y});
}

window.onload = function() {
  canvas = document.getElementById('canvas');
  if (window.PointerEvent) {
    var primaryButtonDown = false;
    
    startDraw();
    canvas.addEventListener('pointerdown', function(e) {
      // if (e.button == 0 && e.isPrimary) {
        primaryButtonDown = true;
        // startDraw();
        addPoint(e.pageX, e.pageY);
        e.preventDefault();
      // }
    });
    canvas.addEventListener('pointermove', function(e) {
      // if (primaryButtonDown && e.isPrimary) {
        if (e.getCoalescedEvents) {
          e.getCoalescedEvents().forEach(function(ce) {
            addCoalescedPoint(ce.pageX, ce.pageY);
          });
        }
        addPoint(e.pageX, e.pageY);
        e.preventDefault();
      // }
    });
    canvas.addEventListener('pointerup', function(e) {
      // if (e.button == 0 && e.isPrimary) {
        // endDraw();
        primaryButtonDown = true;
        e.preventDefault();
      // }
    });
    canvas.addEventListener('touchstart', function(e) {
      e.preventDefault();
    });
  }
  InitializeCanvas();
}

var scale = 1;

function InitializeCanvas() {
  var elem = document.getElementById('canvas');
  var container = document.getElementById('container');
  
  scale = window.devicePixelRatio ? window.devicePixelRatio : 1;
  elem.width = container.clientWidth * scale;
  elem.height = container.clientHeight * scale;
}

function Clear() {
  endDraw();
  startDraw();
}