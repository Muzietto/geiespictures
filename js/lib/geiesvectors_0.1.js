/*
	GEIESVECTORS - A vector-based companion to GEIESLISTS
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1

	The MIT License - Copyright (c) 2016 Geiesvectors Project
*/
var V = function(L) {
  var make_vect = (x, y) => L.ArrayToList([x, y]);
  var xcor_vect = (v) => L.first(v);
  var ycor_vect = (v) => L.second(v);
  var add_vect = (v1, v2) => make_vect(xcor_vect(v1) + xcor_vect(v2), ycor_vect(v1) + ycor_vect(v2));
  var sub_vect = (v1, v2) => make_vect(xcor_vect(v1) - xcor_vect(v2), ycor_vect(v1) - ycor_vect(v2));
  var scale_vect = (v, s) => make_vect(s * xcor_vect(v), s * ycor_vect(v));

  return {
    make_vect: make_vect,
    xcor_vect: xcor_vect,
    ycor_vect: ycor_vect,
    add_vect: add_vect,
    sub_vect: sub_vect,
    scale_vect: scale_vect
  }
}(L);
