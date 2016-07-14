/*
	GEIESPICTURES - The picture language from chapter 2 of SICP
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1 - Requires Geieslists 1.1 and Geiesvectors 0.1

	The MIT License - Copyright (c) 2016 Geiespictures Project
*/

var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(300,150);
ctx.stroke();

var origin = V.make_vect(0,0);
var edge1 = V.make_vect(300,0);
var edge2 = V.make_vect(0,150);
var fram1 = P.make_frame(origin, edge1, edge2);

var coordinateMapper1 = P.frame_coord_map(fram1);
var unitVec = V.make_vect(1,1);
var testVec = V.make_vect(0,0);
var mappedUnit = coordinateMapper1(unitVec);
var mappedTest = coordinateMapper1(testVec);

var oneToTwo = P.make_segment(unitVec, testVec);

P.segments_painter([oneToTwo])(fram1)(ctx);
