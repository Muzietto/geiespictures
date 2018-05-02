/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 1.0 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016-2018 Geiespictures Project
 */
(function () {

  var c = document.getElementById('myCanvas');
  var ctx = c.getContext('2d');
  var qsTextarea = document.getElementById('querystring');
  var screamPic = document.getElementById('scream');
  var rogersPic = document.getElementById('rogers');
  var gwenPic = document.getElementById('gwen');

  qsTextarea.addEventListener('keypress', onTextareaChange);

  repaintCanvas();

  function repaintCanvas() {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    setTimeout(() => {

      IC.paintFromDecomposedQs(qsTextarea.value, ctx);

    }, 200);
  }

  function onTextareaChange() {
    var key = window.event.keyCode;
    if (key === 13) {
      repaintCanvas();
      return false;
    }
    else {
      return true;
    }
  }
})();
