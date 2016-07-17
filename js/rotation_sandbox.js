/*
	GEIESPICTURES - The picture language from chapter 2 of SICP
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1 - Requires Geieslists 1.1 and Geiesvectors 0.1

	The MIT License - Copyright (c) 2016 Geiespictures Project
*/

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var canvasWidth = ctx.canvas.clientWidth;
var canvasHeight = ctx.canvas.clientHeight;

var img = document.getElementById("scream");

// sample applications of the various matrices
var transX200 = V.translation_matrix(200, 0);
var rot30 = V.rotation_matrix(Math.PI/6);
var rot60 = V.rotation_matrix(Math.PI/3);
var doubleX = V.scaling_matrix(2, 1);

// draw translated
P.transform_ctx(ctx, transX200);
ctx.drawImage(img,0,0);
ctx.resetTransform();

// draw rotated 60deg and then translated
P.transform_ctx(ctx, V.mult_matrix(rot60,transX200));
ctx.drawImage(img,0,0);
ctx.resetTransform();

// draw translated twice and then rotated 60deg
P.transform_ctx(ctx, V.mult_matrix(V.mult_matrix(transX200,transX200),rot60));
ctx.drawImage(img,0,0);
ctx.resetTransform();

// draw rotated 30deg and then translated and then scaled 2x
P.transform_ctx(ctx, V.mult_matrix(V.mult_matrix(rot30,transX200),doubleX));
ctx.drawImage(img,0,0);
ctx.resetTransform();
