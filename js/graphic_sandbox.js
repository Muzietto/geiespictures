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
var halfwayRight = V.make_vect(150, 0);
var halfwayUp = V.make_vect(0, 75);
var halfwayLeft = V.make_vect(-150, 0);
var halfwayDown = V.make_vect(0, -75);


// FRAMES
var firstQuarter = P.make_frame(origin, halfwayRight, halfwayUp);
var secondQuarter = P.make_frame(origin, halfwayDown, halfwayRight);
var thirdQuarter = P.make_frame(origin, halfwayLeft, halfwayDown);
var fourthQuarter = P.make_frame(origin, halfwayUp, halfwayLeft);

// painters at work
P.segments_painter([oneThirdToTwoThirds])(firstQuarter)(ctx);
P.segments_painter([oneThirdToTwoThirds])(secondQuarter)(ctx, 'red');
P.segments_painter([oneThirdToTwoThirds])(thirdQuarter)(ctx, 'blue');
P.segments_painter([oneThirdToTwoThirds])(fourthQuarter)(ctx, 'green');

