/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 1.0 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016-2018 Geiespictures Project
*/

var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var qsTextarea = document.getElementById('querystring');
var screamPic = document.getElementById('scream');
var rogersPic = document.getElementById('rogers');
var gwenPic = document.getElementById('gwen');

P.background_painter(gwenPic)()(ctx);

setTimeout(() => {

  var origin = V.make_vect(100, 125);
  var edge1 = V.make_vect(100, 0);
  var edge2 = V.make_vect(0, 100);
  var fram1 = P.make_frame(origin, edge1, edge2);

// drawing a text in the frame origin
  var testo = {
    text: 'lorem ipsum',
    font: '30px Arial',
  };

  P.text_painter(testo)(fram1, true)(ctx);

  var origgio = V.make_vect(0, 0);
  P.single_dot_painter(origgio)(fram1)(ctx);

  let rotation = V.rotation_matrix(Math.PI / 4);
  var edge3 = V.rotate_vect(V.make_vect(100, 0), rotation);
  var edge4 = V.rotate_vect(V.make_vect(0, 100), rotation);
  var fram2 = P.make_frame(V.make_vect(300, 125), edge3, edge4);
  testo.align = 'center';
  testo.baseline = 'middle';
  testo.color = 'red';

  P.text_painter(testo)(fram2, true)(ctx);

  var picOrigin = V.make_vect(100, 225);
  var edge5 = V.make_vect(100, 0);
  var edge6 = V.make_vect(0, 150);
  var fram3 = P.make_frame(picOrigin, edge5, edge6);

  P.picture_painter(screamPic)(fram3, true)(ctx);

  var picOrigin2 = V.make_vect(450, 225);
  let rotation2 = V.rotation_matrix(-Math.PI / 3);
  var edge7 = V.rotate_vect(V.make_vect(300, 0), rotation);
  var edge8 = V.rotate_vect(V.make_vect(0, 100), rotation);
  var fram4 = P.make_frame(picOrigin2, edge7, edge8);

  P.picture_painter(rogersPic)(fram4, true)(ctx);
}, 200);
