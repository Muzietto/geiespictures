/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 0.1 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016 Geiespictures Project
 */

var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');
var canvasWidth = ctx.canvas.clientWidth;
var canvasHeight = ctx.canvas.clientHeight;

// FRAME VECTORS (ORIGINS AND EDGES)
var halfwayDownLeft = V.make_vect(-canvasWidth / 2, -canvasHeight / 2);
var bottomSide = V.make_vect(canvasWidth, 0);
var leftSide = V.make_vect(0, canvasHeight);

// THE FRAME
var wholeCanvas = P.make_frame(halfwayDownLeft, bottomSide, leftSide);

// image painter at work
window.onload = function () {
  var scream = document.getElementById('scream');
  var rogers = document.getElementById('rogers');
  //P.corner_split(P.picture_painter(rogers),4)(wholeCanvas)(ctx);

  //P.centered(P.picture_painter(scream))(wholeCanvas)(ctx);

  P.tree1(P.picture_painter(scream), 8)(wholeCanvas)(ctx);
};
