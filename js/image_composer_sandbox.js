/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 1.0 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016-2018 Geiespictures Project
 */
(function () {

  var canvasParent = document.getElementById('canvasParent');
  var but = document.getElementById('theButton');
  var qsTextarea = document.getElementById('querystring');
  var screamPic = document.getElementById('scream');
  var rogersPic = document.getElementById('rogers');
  var gwenPic = document.getElementById('gwen');

  but.addEventListener('click', repaintCanvas);

  repaintCanvas();

  function repaintCanvas() {

    setTimeout(() => {

      var mainCanvas = IC.dimensionedCanvas(qsTextarea.value);
      while (canvasParent.firstChild) {
        canvasParent.removeChild(canvasParent.firstChild);
      }

      canvasParent.appendChild(mainCanvas);

      IC.paintFromDecomposedQs(qsTextarea.value, mainCanvas.getContext('2d'));

    }, 200);
  }
})();
