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

  var transform_painter = (painter, origin, xAxe, yAxe) => (frame, paintFrame) => {
    var mapper = frame_coord_map(frame);
    return painter(P.make_frame(mapper(origin),
                                V.sub_vect(mapper(xAxe),mapper(origin)),
                                V.sub_vect(mapper(yAxe),mapper(origin))),
                   paintFrame);
  }

  var flip_vert = painter => transform_painter(painter,
                                               V.make_vect(0,1),
                                               V.make_vect(1,1),
                                               V.make_vect(0,0));

  var flip_vert_naive = painter => (frame, paintFrame) => {
    var mapper = frame_coord_map(frame);
    var newOrigin = mapper(V.make_vect(0,1));
    var newXAxis = mapper(V.make_vect(1,1));
    var newYAxis = mapper(V.make_vect(0,0));
    var newFrame = make_frame(newOrigin,
                              V.sub_vect(newXAxis,newOrigin),
                              V.sub_vect(newYAxis,newOrigin));

    return painter(newFrame, paintFrame);
  }

  var frame_painter = (frame, ctx, color) => {
    var frameAxes =
      [
        make_segment(V.make_vect(0,0),V.make_vect(1,0)),        // x-axis
        make_segment(V.make_vect(1,0),V.make_vect(.95,.05)),    // x-arrow
        make_segment(V.make_vect(1,0),V.make_vect(.95,-.05)),   // x-arrow
        make_segment(V.make_vect(.95,.1),V.make_vect(.98,.16)), // x
        make_segment(V.make_vect(.95,.16),V.make_vect(.98,.1)), // x
        make_segment(V.make_vect(0,0),V.make_vect(0,1)),        // y-axis
        make_segment(V.make_vect(0,1),V.make_vect(-.05,.95)),   // y-arrow
        make_segment(V.make_vect(0,1),V.make_vect(.05,.95)),    // y-arrow
        make_segment(V.make_vect(.08,.92),V.make_vect(.13,.98)),// y
        make_segment(V.make_vect(.08,.98),V.make_vect(.1,.95))  // y
      ];
    segments_painter(frameAxes)(frame)(ctx, color);
  }

  var diamond_painter = (frame, paintFrame) => (ctx, color) => {
    var diamondPieces =
      [
        make_segment(V.make_vect(.14,.50),V.make_vect(.50,.86)),
        make_segment(V.make_vect(.50,.86),V.make_vect(.86,.50)),
        make_segment(V.make_vect(.86,.50),V.make_vect(.50,.14)),
        make_segment(V.make_vect(.50,.14),V.make_vect(.14,.50)),

        make_segment(V.make_vect(.28,.50),V.make_vect(.50,.72)),
        make_segment(V.make_vect(.50,.72),V.make_vect(.72,.50)),
        make_segment(V.make_vect(.72,.50),V.make_vect(.50,.28)),
        make_segment(V.make_vect(.50,.28),V.make_vect(.28,.50)),

        make_segment(V.make_vect(.42,.50),V.make_vect(.50,.58)),
        make_segment(V.make_vect(.50,.58),V.make_vect(.58,.50)),
        make_segment(V.make_vect(.58,.50),V.make_vect(.50,.42)),
        make_segment(V.make_vect(.50,.42),V.make_vect(.42,.50)),
        make_segment(V.make_vect(.5,.5),V.make_vect(1,1))
      ];
    segments_painter(diamondPieces)(frame, paintFrame)(ctx, color);
  }

  var picture_painter = img => (frame, paintFrame) => (ctx) => {
    var canvasWidth = ctx.canvas.clientWidth;
    var canvasHeight = ctx.canvas.clientHeight;
    // accepting only vert/hor-aligned frames
    var frameWidthPx = V.xcor_vect(frame_coord_map(frame)(V.make_vect(1,0))) - V.xcor_vect(frame_coord_map(frame)(V.make_vect(0,0)));
    var frameHeightPx = V.ycor_vect(frame_coord_map(frame)(V.make_vect(0,1))) - V.ycor_vect(frame_coord_map(frame)(V.make_vect(0,0)));
    var imgWidth = img.width;
    var imgHeight = img.height;
    var imgWidthScale = frameWidthPx/imgWidth;
    var imgHeightScale = frameHeightPx/imgHeight;
    var newOriginX = canvasWidth/2;
    var newOriginY = canvasHeight/2;
    var X = x => x + newOriginX;
    var Y = y => -(y + newOriginY + imgHeight) + canvasHeight;
    if (paintFrame) frame_painter(frame, ctx);
    var draw_img = img => {
      // transform(a,b,c,d,e,f) = (hor.scal., hor.skew., vertskew., vert.scal., hor.mov., vert.mov.)
      //ctx.transform(1.1,0,0,1,0,0);
      ctx.scale(imgWidthScale,1);
      //ctx.translate(-X(V.xcor_vect(origin_frame(frame)))*.78,0);
      //ctx.translate(-X(V.xcor_vect(origin_frame(frame)))*(imgWidthScale-1),0);
      ctx.drawImage(img, X(V.xcor_vect(origin_frame(frame))), Y(V.ycor_vect(origin_frame(frame))));
      ctx.resetTransform();
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
    picture_painter: picture_painter,
    diamond_painter: diamond_painter,
    flip_vert: flip_vert,
    flip_vert_naive: flip_vert_naive
  }
}(L, V);
