/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 1.0 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016-2018 Geiespictures Project
 */
var P = function (L, V) {
  var make_frame = (origin, edge1, edge2) => L.ArrayToList([origin, edge1, edge2]);
  var origin_frame = frame => L.first(frame);
  var edge1_frame = frame => L.second(frame);
  var edge2_frame = frame => L.third(frame);

  // canvas pixels relative to canvas origin
  var frame_coord_map = frame => vector =>
    V.add_vect(
      origin_frame(frame),
      V.add_vect(
        // [
        //   V.xcor_vect(vector)*V.xcor.vect(edge1_frame(frame)),
        //   V.xcor_vect(vector)*V.ycor.vect(edge1_frame(frame)),
        // ]
        V.scale_vect(edge1_frame(frame), V.xcor_vect(vector)),

        // [
        //   V.ycor_vect(vector)*V.xcor.vect(edge2_frame(frame)),
        //   V.ycor_vect(vector)*V.ycor.vect(edge2_frame(frame)),
        // ]
        V.scale_vect(edge2_frame(frame), V.ycor_vect(vector))
      )
    );

  var make_segment = (start, end) => L.ArrayToList([start, end]);
  var start_segment = segment => L.first(segment);
  var end_segment = segment => L.second(segment);

  var transform_ctx = (ctx, matrix) => {
    ctx.transform(matrix._11(),
      matrix._21(),
      matrix._12(),
      matrix._22(),
      matrix._13(),
      matrix._23());
  };

  // painter(what)(where)(canvasContext)

  // origin is canvas center; y going up
  var segments_painterSICP = segments => (frame, paintFrame) => (ctx, color) => {
    color = color || '#000000';

    if (paintFrame) frame_painter(frame, ctx, color);

    var canvasWidth = ctx.canvas.clientWidth;
    var canvasHeight = ctx.canvas.clientHeight;
    var newCanvasOriginX = canvasWidth / 2;
    var newCanvasOriginY = canvasHeight / 2;
    var X = x => x + newCanvasOriginX;
    var Y = y => -(y + newCanvasOriginY) + canvasHeight;

    var draw_segment = segment => {

      ctx.resetTransform();
      var coordinateMapper = frame_coord_map(frame);
      var startPoint = coordinateMapper(start_segment(segment));
      var endPoint = coordinateMapper(end_segment(segment));
      ctx.beginPath();
      ctx.moveTo(X(V.xcor_vect(startPoint)), Y(V.ycor_vect(startPoint)));
      ctx.lineTo(X(V.xcor_vect(endPoint)), Y(V.ycor_vect(endPoint)));
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.resetTransform();
    };

    segments.forEach(draw_segment);
  };

  // origin is canvas top-left corner; y going down
  var segments_painter = segments => (frame, paintFrame) => (ctx, color) => {
    color = color || '#000000';

    if (paintFrame) frame_painter(frame, ctx, color);

    var coordinateMapper = frame_coord_map(frame);

    var draw_segment = segment => {

      ctx.resetTransform();
      var startPoint = coordinateMapper(start_segment(segment));
      var endPoint = coordinateMapper(end_segment(segment));
      ctx.beginPath();
      ctx.moveTo(V.xcor_vect(startPoint), V.ycor_vect(startPoint));
      ctx.lineTo(V.xcor_vect(endPoint), V.ycor_vect(endPoint));
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.resetTransform();
    };

    segments.forEach(draw_segment);
  };

  // origin is canvas center; y going up
  var single_dot_painterSICP = point => (frame, paintFrame) => (ctx, color) => {
    color = color || '#000000';

    if (paintFrame) frame_painter(frame, ctx, color);

    var canvasWidth = ctx.canvas.clientWidth;
    var canvasHeight = ctx.canvas.clientHeight;
    var newCanvasOriginX = canvasWidth / 2;
    var newCanvasOriginY = canvasHeight / 2;
    var X = x => x + newCanvasOriginX;
    var Y = y => -(y + newCanvasOriginY) + canvasHeight;

    var coordinateMapper = frame_coord_map(frame);
    var mappedPoint = coordinateMapper(point);

    ctx.resetTransform();
    ctx.beginPath();
    // draw a circle with radius 1 pixel
    ctx.arc(X(V.xcor_vect(mappedPoint)), Y(V.ycor_vect(mappedPoint)), 1, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.resetTransform();

  };

  // origin is canvas top-left corner; y going down
  var single_dot_painter = point => (frame, paintFrame) => (ctx, color) => {

    color = color || '#000000';

    if (paintFrame) frame_painter(frame, ctx, color);

    var coordinateMapper = frame_coord_map(frame);
    var mappedPoint = coordinateMapper(point);

    ctx.resetTransform();
    ctx.beginPath();
    // draw a circle with radius 1 pixel
    ctx.arc(V.xcor_vect(mappedPoint), V.ycor_vect(mappedPoint), 1, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.resetTransform();

  };

  // origin is canvas top-left corner; y going down
  var text_painter = textObj => (frame, paintFrame) => (ctx, color) => {

    color = color || '#000000';

    if (paintFrame) frame_painter(frame, ctx, color);

    var coordinateMapper = frame_coord_map(frame);
    var textPosition = coordinateMapper(textObj.position || V.make_vect(0, 0));
    var frameRotationAngle = V.angle_vect(edge1_frame(frame));

    ctx.resetTransform();
    ctx.translate(V.xcor_vect(textPosition), V.ycor_vect(textPosition));
    ctx.rotate(frameRotationAngle);
    ctx.font = textObj.font;
    ctx.fillText(textObj.text, 0, 0);
    ctx.resetTransform();
  };

  var transform_painter = (painter, origin, xAxis, yAxis) => (frame, paintFrame) => {

    var mapper = frame_coord_map(frame);

    var newFrame = P.make_frame(
      mapper(origin),
      V.sub_vect(mapper(xAxis), mapper(origin)),
      V.sub_vect(mapper(yAxis), mapper(origin))
    );

    return painter(newFrame, paintFrame);
  };

  var beside = (p1, p2) => {
    var leftPainter = transform_painter(p1, V.make_vect(0, 0), V.make_vect(0.5, 0), V.make_vect(0, 1));
    var rightPainter = transform_painter(p2, V.make_vect(0.5, 0), V.make_vect(1, 0), V.make_vect(0.5, 1));
    return (frame, paintFrame) => (ctx, color) => {
      leftPainter(frame, paintFrame)(ctx, color);
      rightPainter(frame, paintFrame)(ctx, color);
    };
  };

  var atop = (p1, p2) => {
    var topPainter = transform_painter(p1, V.make_vect(0, .5), V.make_vect(1, .5), V.make_vect(0, 1));
    var bottomPainter = transform_painter(p2, V.make_vect(0, 0), V.make_vect(1, 0), V.make_vect(0, .5));
    return (frame, paintFrame) => (ctx, color) => {
      topPainter(frame, paintFrame)(ctx, color);
      bottomPainter(frame, paintFrame)(ctx, color);
    };
  };

  var right_split = (painter, n) => {
    if (n === 0) {
      return painter;
    } else {
      var smaller = right_split(painter, n - 1);
      return beside(painter, atop(smaller, smaller));
      //return beside(painter, right_split(painter, n-1));
    }
  };

  var top_split = (painter, n) => {
    if (n === 0) {
      return painter;
    } else {
      var smaller = top_split(painter, n - 1);
      return atop(beside(smaller, smaller), painter);
      //return beside(painter, right_split(painter, n-1));
    }
  };

  var corner_split = (painter, n) => {
    if (n === 0) {
      return painter;
    } else {
      return beside(atop(top_split(painter, n - 1), painter),
        atop(corner_split(painter, n - 1), right_split(painter, n - 1)));
    }
  };

  var centered = painter => transform_painter(painter,
    V.make_vect(.25, 0),
    V.make_vect(.75, 0),
    V.make_vect(0, 1));

  var tree1 = (painter, n) => {
    if (n === 0) {
      return painter;
    } else {
      var next = tree1(painter, n - 1);
      return atop(beside(next, next), centered(painter));
    }
  };

  var flip_vert = painter => transform_painter(painter,
    V.make_vect(0, 1), // new origin
    V.make_vect(1, 1), // new END of xAxe in old frame coords
    V.make_vect(0, 0));// new END of yAxe in old frame coords

  var flip_horiz = painter => transform_painter(painter,
    V.make_vect(1, 0), // new origin
    V.make_vect(0, 0), // new END of xAxe
    V.make_vect(1, 1));// new END of yAxe

  var shrink_to_upper_right = painter => transform_painter(painter,
    V.make_vect(.5, .5), // new origin
    V.make_vect(1, .5), // new END of xAxe in old frame coords
    V.make_vect(.5, 1));// new END of yAxe in old frame coords

  // paints also rotated/skewed frames
  var frame_painter = (frame, ctx, color) => {
    var frameAxes =
      [
        make_segment(V.make_vect(0, 0), V.make_vect(1, 0)),        // x-axis
        make_segment(V.make_vect(1, 0), V.make_vect(.95, .05)),    // x-arrow
        make_segment(V.make_vect(1, 0), V.make_vect(.95, -.05)),   // x-arrow
        make_segment(V.make_vect(.95, .1), V.make_vect(.98, .16)), // x
        make_segment(V.make_vect(.95, .16), V.make_vect(.98, .1)), // x
        make_segment(V.make_vect(0, 0), V.make_vect(0, 1)),        // y-axis
        make_segment(V.make_vect(0, 1), V.make_vect(-.05, .95)),   // y-arrow
        make_segment(V.make_vect(0, 1), V.make_vect(.05, .95)),    // y-arrow
        make_segment(V.make_vect(.08, .92), V.make_vect(.13, .98)),// y
        make_segment(V.make_vect(.08, .98), V.make_vect(.1, .95))  // y
      ];
    segments_painter(frameAxes)(frame)(ctx, color);
  };

  var naked_frame = frame => segments_painter([])(frame, true);

  var diamond_painter = (frame, paintFrame) => (ctx, color) => {
    var diamondPieces =
      [
        make_segment(V.make_vect(.14, .50), V.make_vect(.50, .86)),
        make_segment(V.make_vect(.50, .86), V.make_vect(.86, .50)),
        make_segment(V.make_vect(.86, .50), V.make_vect(.50, .14)),
        make_segment(V.make_vect(.50, .14), V.make_vect(.14, .50)),

        make_segment(V.make_vect(.28, .50), V.make_vect(.50, .72)),
        make_segment(V.make_vect(.50, .72), V.make_vect(.72, .50)),
        make_segment(V.make_vect(.72, .50), V.make_vect(.50, .28)),
        make_segment(V.make_vect(.50, .28), V.make_vect(.28, .50)),

        make_segment(V.make_vect(.42, .50), V.make_vect(.50, .58)),
        make_segment(V.make_vect(.50, .58), V.make_vect(.58, .50)),
        make_segment(V.make_vect(.58, .50), V.make_vect(.50, .42)),
        make_segment(V.make_vect(.50, .42), V.make_vect(.42, .50)),
        make_segment(V.make_vect(.5, .5), V.make_vect(1, 1))
      ];
    segments_painter(diamondPieces)(frame, paintFrame)(ctx, color);
  };

  var picture_painter = img => (frame, paintFrame) => ctx => {

    ctx.resetTransform();

    var imgWidth = img.width;
    var imgHeight = img.height;
    var canvasWidth = ctx.canvas.clientWidth;
    var canvasHeight = ctx.canvas.clientHeight;
    var frameWidth = V.length_vect(edge1_frame(frame));
    var frameHeight = V.length_vect(edge2_frame(frame));

    var newCanvasOriginX = canvasWidth / 2;
    var newCanvasOriginY = canvasHeight / 2;
    ctx.translate(newCanvasOriginX, newCanvasOriginY);

    var mapper = frame_coord_map(frame);
    var frameOriginX = V.xcor_vect(origin_frame(frame));
    var frameOriginY = V.ycor_vect(origin_frame(frame));
    ctx.translate(frameOriginX, -frameOriginY);

    // currently ignoring skewed y-axes
    var frameRotation = V.angle_vect(edge1_frame(frame));
    ctx.rotate(-frameRotation);

    // final vertical transfer
    ctx.translate(0, -frameHeight);

    var imgWidthScale = frameWidth / imgWidth;
    var imgHeightScale = frameHeight / imgHeight;
    ctx.scale(imgWidthScale, imgHeightScale);

    // transform(a,b,c,d,e,f) = (hor.scal., hor.skew., vertskew., vert.scal., hor.mov., vert.mov.)
    ctx.drawImage(img, 0, 0);
    ctx.resetTransform();

    if (paintFrame) frame_painter(frame, ctx);
  };

  var decomposedQs = qs => {

    var qsPieces = splitQuerystring(qs);
    var components = componentsData(qsPieces);

    return {
      process: processData(qsPieces, components),
      components: components,
    };

    function splitQuerystring(string) {
      return string.split('&'); // TODO filter away null items
    }

    function processData(arra, components) {
      return arra.reduce((acc, curr) => {
        switch (curr.substr(0, 5)) {
          case 'order': {
            var canvasBackground = Object.keys(components.bkgImg)[0] || 'nullBackground';
            var canvasComponents = decodeURIComponent(curr.split('=')[1]).split(',');
            acc.order = [canvasBackground].concat(canvasComponents);
          }
          default: {
          }
        }
        return acc;
      }, {});
    }

    function componentsData(arra) {

      return arra.reduce((acc, curr) => {

        if (!curr) return acc;

        var qsKey = curr.split('=')[0];
        var qsValue = curr.split('=')[1];
        var canvasComponentName = qsKey.split('_')[0];
        if (canvasComponentName === 'order') return acc;

        var canvasComponentType = /[a-zA-Z]+/.exec(canvasComponentName)[0];
        var paramName = qsKey.split('_')[1];

        if (!acc[canvasComponentType]) acc[canvasComponentType] = {};
        if (!acc[canvasComponentType][canvasComponentName])
          acc[canvasComponentType][canvasComponentName] = {};

        acc[canvasComponentType][canvasComponentName][paramName] = qsValue;

        return acc;
      }, {});
    }


  };

  return {
    make_frame: make_frame,
    origin_frame: origin_frame,
    edge1_frame: edge1_frame,
    edge2_frame: edge2_frame,
    frame_coord_map: frame_coord_map,
    make_segment: make_segment,
    transform_ctx: transform_ctx,
    single_dot_painterSICP: single_dot_painterSICP,
    segments_painterSICP: segments_painterSICP,
    single_dot_painter: single_dot_painter,
    segments_painter: segments_painter,
    text_painter: text_painter,
    picture_painter: picture_painter,
    naked_frame: naked_frame,
    diamond_painter: diamond_painter,
    flip_vert: flip_vert,
    flip_horiz: flip_horiz,
    shrink_to_upper_right: shrink_to_upper_right,
    beside: beside,
    atop: atop,
    right_split: right_split,
    top_split: top_split,
    corner_split: corner_split,
    centered: centered,
    tree1: tree1,
    decomposedQs: decomposedQs,
  };
}(L, V);
