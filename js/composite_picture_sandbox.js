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
var qsInput = document.getElementById('querystring');

var origin = V.make_vect(100, 125);
var edge1 = V.make_vect(100, 0);
var edge2 = V.make_vect(0, 100);
var fram1 = P.make_frame(origin, edge1, edge2);

// drawing a text in the frame origin
var testo = {
  text: 'lorem ipsum',
  font: '30px Arial',
  position: V.make_vect(0, 0),
};

P.text_painter(testo)(fram1,true)(ctx);

var origgio = V.make_vect(0, 0);
P.single_dot_painter(origgio)(fram1)(ctx);
