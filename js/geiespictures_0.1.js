/*
	GEIESPICTURES - The picture language from chapter 2 of SICP
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1 - Requires Geieslists 1.1 and Geiesvectors 0.1

	The MIT License - Copyright (c) 2016 Geiespictures Project
*/
var P = function(L, V) {
  var make_frame = (origin, edge1, edge2) => L.ArrayToList([origin, edge1, edge2]);
  var origin_frame = frame => L.first(frame);
  var edge1_frame = frame => L.second(frame);
  var edge2_frame = frame => L.third(frame);

  var frame_coord_map = frame => vector =>
    V.add_vect(origin_frame(frame),
               V.add_vect(V.scale_vect(edge1_frame(frame),
                                       V.xcor_vect(vector)),
                          V.scale_vect(edge2_frame(frame),
                                       V.ycor_vect(vector))));

  var make_segment = (start, end) => L.ArrayToList([start, end]);
  var start_segment = segment => L.first(segment);
  var end_segment = segment => L.second(segment);

  // painter(what)(where)(canvasContext)
  var segments_painter = segments => (frame, paintFrame) => (ctx, color) => {
    color = color || '#000000';
    if (paintFrame) frame_painter(frame, ctx, color);
    var canvasWidth = ctx.canvas.clientWidth;
    var canvasHeight = ctx.canvas.clientHeight;
    var newOriginX = canvasWidth/2;
    var newOriginY = canvasHeight/2;
    var X = x => x + newOriginX;
    var Y = y => -(y + newOriginY) + canvasHeight;
    var draw_segment = segment => {
      var coordinateMapper = frame_coord_map(frame);
      var startPoint = coordinateMapper(start_segment(segment));
      var endPoint = coordinateMapper(end_segment(segment));
      ctx.beginPath();
      ctx.moveTo(X(V.xcor_vect(startPoint)), Y(V.ycor_vect(startPoint)));
      ctx.lineTo(X(V.xcor_vect(endPoint)), Y(V.ycor_vect(endPoint)));
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    segments.forEach(draw_segment);
  }

  var frame_painter = (frame, ctx, color) => {
    var frameAxes =
      [
        make_segment(V.make_vect(0,0),V.make_vect(1,0)),
        make_segment(V.make_vect(1,0),V.make_vect(.95,.05)),
        make_segment(V.make_vect(1,0),V.make_vect(.95,-.05)),
        make_segment(V.make_vect(0,0),V.make_vect(0,1)),
        make_segment(V.make_vect(0,1),V.make_vect(-.05,.95)),
        make_segment(V.make_vect(0,1),V.make_vect(.05,.95))
      ];
    segments_painter(frameAxes)(frame)(ctx, color);
  }

  var picture_painter = img => (frame, paintFrame) => (ctx) => {
    var canvasWidth = ctx.canvas.clientWidth;
    var canvasHeight = ctx.canvas.clientHeight;
    var imgWidth = img.width;
    var imgHeight = img.height;
    var newOriginX = canvasWidth/2;
    var newOriginY = canvasHeight/2;
    var X = x => x + newOriginX;
    var Y = y => -(y + newOriginY + imgHeight) + canvasHeight;
    if (paintFrame) frame_painter(frame, ctx);
    var draw_img = img => {
      ctx.drawImage(img, X(V.xcor_vect(origin_frame(frame))), Y(V.ycor_vect(origin_frame(frame))));
    }
    draw_img(img);
  }
  return {
    make_frame: make_frame,
    origin_frame: origin_frame,
    edge1_frame: edge1_frame,
    edge2_frame: edge2_frame,
    frame_coord_map: frame_coord_map,
    make_segment: make_segment,
    segments_painter: segments_painter,
    picture_painter: picture_painter
  }
}(L, V);
