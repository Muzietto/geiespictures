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
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(300, 150);
ctx.strokeStyle = '#ff0000';
//ctx.stroke();

//window.onload = function() {
//    var c=document.getElementById("myCanvas");
//    var ctx=c.getContext("2d");
//    var img=document.getElementById("scream");
//    ctx.drawImage(img,10,10);
//};

var point = (canvasX, canvasY) => {
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 1, 0, 2 * Math.PI, true);
    ctx.fill();
}

var canvasWidth = ctx.canvas.clientWidth;
var canvasHeight = ctx.canvas.clientHeight;

// VECTORS
var zeroVec = V.make_vect(0, 0);
var unitVec = V.make_vect(1, 1);
var oneThird = V.make_vect(1/3, 1/3);
var twoThirds = V.make_vect(2/3, 2/3);

// SEGMENTS
var zeroToOne = P.make_segment(zeroVec, unitVec);
var oneThirdToTwoThirds = P.make_segment(oneThird, twoThirds);

// FRAME VECTORS (ORIGINS AND EDGES)
var origin = V.make_vect(0, 0);
var halfwayRight = V.make_vect(canvasWidth/2, 0);
var halfwayUp = V.make_vect(0, canvasHeight/2);
var halfwayLeft = V.make_vect(-canvasWidth/2, 0);
var halfwayDown = V.make_vect(0, -canvasHeight/2);
var quarterRight = V.make_vect(canvasWidth/4, 0);
var quarterUp = V.make_vect(0, canvasHeight/4);
var quarterLeft = V.make_vect(-canvasWidth/4, 0);
var quarterDown = V.make_vect(0, -canvasHeight/4);

var halfwayRightUp = V.make_vect(canvasWidth/2, canvasHeight/2);
var quartWayRightUp = V.make_vect(canvasWidth/4, canvasHeight/4);


// FRAMES
var firstQuarter = P.make_frame(origin, halfwayRight, halfwayUp);
var secondQuarter = P.make_frame(origin, halfwayDown, halfwayRight);
var thirdQuarter = P.make_frame(origin, halfwayLeft, halfwayDown);
var fourthQuarter = P.make_frame(origin, halfwayUp, halfwayLeft);
var quarterRightUp = P.make_frame(quartWayRightUp, quarterRight, quarterUp);
var quarterRightUpFromOrigin = P.make_frame(origin, quarterRight, quarterUp);
// next one is rotated 180deg clockwise
var quarterLeftDownFromOrigin = P.make_frame(origin, quarterLeft, quarterDown);

// painters at work
P.segments_painter([oneThirdToTwoThirds])(firstQuarter)(ctx);
P.segments_painter([oneThirdToTwoThirds])(secondQuarter,true)(ctx, 'red');
P.segments_painter([oneThirdToTwoThirds])(thirdQuarter)(ctx, 'blue');
P.segments_painter([oneThirdToTwoThirds])(fourthQuarter,true)(ctx, 'green');

// image painter at work
window.onload = function() {
    point(canvasWidth/2,canvasHeight/2);
    var img = document.getElementById("scream");
    P.picture_painter(img)(quarterRightUp,true)(ctx);
    P.picture_painter(img)(thirdQuarter)(ctx);
    P.flip_vert_naive(P.picture_painter(img))(quarterLeftDownFromOrigin,true)(ctx);
};

P.diamond_painter(quarterRightUp,true)(ctx);

P.flip_vert(P.diamond_painter)(quarterRightUpFromOrigin,true)(ctx);
