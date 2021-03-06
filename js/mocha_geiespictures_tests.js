/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 0.1 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016 Geiespictures Project
 */

var expect = chai.expect;
//		expect(head(head(listlA_BA))).to.be.equal('a');
//		expect(isEmpty(tail(head(listlA_BA)))).to.be.ok;
//		expect(isEmpty(tail(EMPTY))).to.be.not.ok;

var probe = () => {
  return {
    origin: {x: 0, y: 0},
    rotation: 0,
  };
};

var fakeCtx = () => probe => {
  return {
    font: '',
    canvas: {
      clientWidth: 400,
      clientHeight: 200
    },
    resetTransform: () => {
    },
    measureText: () => {
      return {width: 0};
    },
    translate: (x, y) => {
      probe.origin.x = x;
      probe.origin.y = y;
    },
    rotate: (rotation) => {
      probe.rotation = rotation;
    },
    beginPath: () => {
    },
    moveTo: (x, y) => {
      probe.startX = x;
      probe.startY = y;
    },
    lineTo: (x, y) => {
      probe.endX = x;
      probe.endY = y;
    },
    arc: (cx, cy, r, start, end) => {
      probe.centerX = cx;
      probe.centerY = cy;
      probe.radius = r;
    },
    fillText: (text, x, y) => {
      probe.textPosX = probe.origin.x + x;
      probe.textPosY = probe.origin.y + y;
      probe.text = text;
    },
    stroke: () => {
    },
    transform: (m11, m21, m12, m22, m13, m23) => {
      probe._11 = m11;
      probe._21 = m21;
      probe._12 = m12;
      probe._22 = m22;
      probe._13 = m13;
      probe._23 = m23;
    }
  };
};

describe('a sound picture system requires', function () {

  it('a series of vector operations that allow to measure, sum, subtract, scale, rotate and align vectors', function () {

    var pippo = V.make_vect(-3, 1);
    var pluto = V.make_vect(-2, 3);
    expect(V.length_vect(pippo)).to.be.gt(3.16);
    expect(V.length_vect(pippo)).to.be.lt(3.17);

    var added = V.add_vect(pippo, pluto);
    expect(added.c).to.be.equal('[-5,4]');

    var subtracted = V.sub_vect(pippo, pluto);
    expect(subtracted.c).to.be.equal('[-1,-2]');

    var scaled = V.scale_vect(pippo, 2);
    expect(scaled.c).to.be.equal('[-6,2]');

    var deg30 = V.make_vect(Math.sqrt(3) / 2, .5);
    expect(V.angle_vect(deg30)).to.be.gt(0.523);
    expect(V.angle_vect(deg30)).to.be.lt(0.524);

    var deg45 = V.make_vect(1, 1);
    // rotated direction given by a vector
    var deg75v = V.rotate_vect(deg30, deg45);
    expect(V.length_vect(deg75v)).to.be.gt(0.999);
    expect(V.length_vect(deg75v)).to.be.lt(1.001);
    expect((V.angle_vect(deg75v) / 7.5) * 18).to.be.lt(3.141593);
    expect((V.angle_vect(deg75v) / 7.5) * 18).to.be.gt(3.141592);
    // rotated direction given by a matrix
    var deg75m = V.rotate_vect(deg30, V.rotation_matrix(Math.PI / 4));
    expect(V.length_vect(deg75m)).to.be.gt(0.999);
    expect(V.length_vect(deg75m)).to.be.lt(1.001);
    expect((V.angle_vect(deg75m) / 7.5) * 18).to.be.lt(3.141593);
    expect((V.angle_vect(deg75m) / 7.5) * 18).to.be.gt(3.141592);

    var aligned = V.align_vect(pippo, deg45);
    expect(V.length_vect(aligned)).to.be.gt(3.16);
    expect(V.length_vect(aligned)).to.be.lt(3.17);
    expect(V.xcor_vect(aligned)).to.be.equal(V.ycor_vect(aligned));

  });

  it('a series of matrix operations for HTML5 canvases', function () {

    var pippo = V.transf_matrix(11, 12, 13, 21, 22, 23, 31, 32, 33);
    expect(pippo._11()).to.be.equal(11);
    expect(pippo._12()).to.be.equal(12);
    expect(pippo._13()).to.be.equal(13);
    expect(pippo._21()).to.be.equal(21);
    expect(pippo._22()).to.be.equal(22);
    expect(pippo._23()).to.be.equal(23);
    expect(pippo._31()).to.be.equal(31);
    expect(pippo._32()).to.be.equal(32);
    expect(pippo._33()).to.be.equal(33);

    var x = V.transf_matrix(1, 2, 3, 4, 5, 6, 7, 8, 9);
    var y = V.transf_matrix(5, 6, 7, 8, 9, 10, 11, 12, 13);
    var xy = V.mult_matrix(x, y);
    expect(xy._11()).to.be.equal(54);
    expect(xy._12()).to.be.equal(60);
    expect(xy._13()).to.be.equal(66);
    expect(xy._21()).to.be.equal(126);
    expect(xy._22()).to.be.equal(141);
    expect(xy._23()).to.be.equal(156);
    expect(xy._31()).to.be.equal(198);
    expect(xy._32()).to.be.equal(222);
    expect(xy._33()).to.be.equal(246);

    var x_plus_y = V.add_matrix(x, y);
    expect(x_plus_y._11()).to.be.equal(6);
    expect(x_plus_y._12()).to.be.equal(8);
    expect(x_plus_y._13()).to.be.equal(10);
    expect(x_plus_y._21()).to.be.equal(12);
    expect(x_plus_y._22()).to.be.equal(14);
    expect(x_plus_y._23()).to.be.equal(16);
    expect(x_plus_y._31()).to.be.equal(18);
    expect(x_plus_y._32()).to.be.equal(20);
    expect(x_plus_y._33()).to.be.equal(22);

    var translated = V.translation_matrix(2, 5);
    expect(translated._11()).to.be.equal(1);
    expect(translated._12()).to.be.equal(0);
    expect(translated._13()).to.be.equal(2);
    expect(translated._21()).to.be.equal(0);
    expect(translated._22()).to.be.equal(1);
    expect(translated._23()).to.be.equal(5);
    expect(translated._31()).to.be.equal(0);
    expect(translated._32()).to.be.equal(0);
    expect(translated._33()).to.be.equal(1);

    var scaled = V.scaling_matrix(2, 5);
    expect(scaled._11()).to.be.equal(2);
    expect(scaled._12()).to.be.equal(0);
    expect(scaled._13()).to.be.equal(0);
    expect(scaled._21()).to.be.equal(0);
    expect(scaled._22()).to.be.equal(5);
    expect(scaled._23()).to.be.equal(0);
    expect(scaled._31()).to.be.equal(0);
    expect(scaled._32()).to.be.equal(0);
    expect(scaled._33()).to.be.equal(1);

    var rot30 = V.rotation_matrix(Math.PI / 6);
    expect(Math.round(100 * rot30._11())).to.be.equal(87);
    expect(Math.round(100 * rot30._12())).to.be.equal(-50);
    expect(Math.round(100 * rot30._13())).to.be.equal(0);
    expect(Math.round(100 * rot30._21())).to.be.equal(50);
    expect(Math.round(100 * rot30._22())).to.be.equal(87);
    expect(Math.round(100 * rot30._23())).to.be.equal(0);
    expect(Math.round(100 * rot30._31())).to.be.equal(0);
    expect(Math.round(100 * rot30._32())).to.be.equal(0);
    expect(Math.round(100 * rot30._33())).to.be.equal(100);

    var trasl200x = V.translation_matrix(200, 0);
    var scale2x = V.scaling_matrix(2, 1);

    // translate then rotate then scale
    var traslRotoScale = V.mult_matrix(V.mult_matrix(trasl200x, rot30), scale2x);
    // next one is (1.73,1,-.5,.87,200,0)
    expect(Math.round(100 * traslRotoScale._11())).to.be.equal(173);
    expect(Math.round(100 * traslRotoScale._12())).to.be.equal(-50);
    expect(Math.round(100 * traslRotoScale._13())).to.be.equal(20000);
    expect(Math.round(100 * traslRotoScale._21())).to.be.equal(100);
    expect(Math.round(100 * traslRotoScale._22())).to.be.equal(87);
    expect(Math.round(100 * traslRotoScale._23())).to.be.equal(0);
    expect(Math.round(100 * traslRotoScale._31())).to.be.equal(0);
    expect(Math.round(100 * traslRotoScale._32())).to.be.equal(0);
    expect(Math.round(100 * traslRotoScale._33())).to.be.equal(100);

    // rotate then translate then scale
    var rotoTraslScale = V.mult_matrix(V.mult_matrix(rot30, trasl200x), scale2x);
    // next one is (1.73,1,-.5,.87,174,100) <-- !!
    expect(Math.round(100 * rotoTraslScale._11())).to.be.equal(173);
    expect(Math.round(100 * rotoTraslScale._12())).to.be.equal(-50);
    expect(Math.round(100 * rotoTraslScale._13())).to.be.equal(17321);
    expect(Math.round(100 * rotoTraslScale._21())).to.be.equal(100);
    expect(Math.round(100 * rotoTraslScale._22())).to.be.equal(87);
    expect(Math.round(100 * rotoTraslScale._23())).to.be.equal(10000);
    expect(Math.round(100 * rotoTraslScale._31())).to.be.equal(0);
    expect(Math.round(100 * rotoTraslScale._32())).to.be.equal(0);
    expect(Math.round(100 * rotoTraslScale._33())).to.be.equal(100);

    var deg30 = V.make_vect(.87, .5);
    expect(Math.round(100 * V.angle_vect(deg30))).to.be.equal(52);

    var minusDeg30 = V.make_vect(.87, -.5);
    expect(Math.round(100 * V.angle_vect(minusDeg30))).to.be.equal(-52);

    var minusDeg60 = V.make_vect(.5, -.87);
    expect(Math.round(100 * V.angle_vect(minusDeg60))).to.be.equal(-105);

    var deg120 = V.make_vect(-.5, .87);
    expect(Math.round(100 * V.angle_vect(deg120))).to.be.equal(209);

    var testProbe = probe();
    var fakeContext = fakeCtx()(testProbe);
    var transfMatrix = V.transf_matrix(11, 12, 13, 21, 22, 23, 31, 32, 33);
    P.transform_ctx(fakeContext, transfMatrix);
    expect(testProbe._11).to.be.equal(11);
    expect(testProbe._21).to.be.equal(21);
    expect(testProbe._12).to.be.equal(12);
    expect(testProbe._22).to.be.equal(22);
    expect(testProbe._13).to.be.equal(13);
    expect(testProbe._23).to.be.equal(23);
  });

  it('definitions for fold left and right', function () {
    expect(L.fold((x, ys) => x + ys, 0, L.ArrayToList([1, 3, 5]))).to.be.equal(9);
    expect(L.foldl((acc, x) => acc + x, 0, L.ArrayToList([1, 3, 6]))).to.be.equal(10);
  });
});

describe('a sound picture system entails', function () {

  it('functions to handle frames', function () {

    var origin = V.make_vect(-3, 1);
    var edge1 = V.make_vect(5, 3);
    var edge2 = V.make_vect(-2, 3);
    var fram1 = P.make_frame(origin, edge1, edge2);

    expect(P.origin_frame(fram1).c).to.be.equal('[-3,1]');
    expect(P.edge1_frame(fram1).c).to.be.equal('[5,3]');
    expect(P.edge2_frame(fram1).c).to.be.equal('[-2,3]');
  });

  it('a coordinateMapper, measuring pixels relative to the canvas origin', function () {

    var origin = V.make_vect(-3, 1);
    var edge1 = V.make_vect(5, 3);
    var edge2 = V.make_vect(-2, 3);
    var fram1 = P.make_frame(origin, edge1, edge2);

    var coordinateMapper1 = P.frame_coord_map(fram1);

    var unitVec = V.make_vect(1, 1);
    var testVec = V.make_vect(2, 2);
    var testVec2 = V.make_vect(2, 0);
    var mappedUnit = coordinateMapper1(unitVec);
    var mappedTest = coordinateMapper1(testVec);
    var mappedTest2 = coordinateMapper1(testVec2);

    expect(mappedUnit.c).to.be.equal('[0,7]');
    expect(mappedTest.c).to.be.equal('[3,13]');
    expect(mappedTest2.c).to.be.equal('[7,7]');

  });

  describe('painters that use the center of a canvas as origin and flip its y-axe to be positive upwards, like', () => {
    it('a single_dot_painterSICP that takes a point in a frame and converts its coordinates into DOM canvas pixel coords', function () {

      var origin = V.make_vect(-100, 25);
      var edge1 = V.make_vect(0, 50);
      var edge2 = V.make_vect(-100, 0);
      var fram1 = P.make_frame(origin, edge1, edge2);

      var testProbe = probe();
      var fakeContext = fakeCtx()(testProbe); // canvas 400x200

      // drawing a point in the frame origin
      var origgio = V.make_vect(0, 0);
      P.single_dot_painterSICP(origgio)(fram1)(fakeContext);

      expect(testProbe.centerX).to.be.equal(100);
      expect(testProbe.centerY).to.be.equal(75);
      expect(testProbe.radius).to.be.equal(1);

      // drawing a point at (1,1) in the frame reference
      var unouno = V.make_vect(1, 1);
      P.single_dot_painterSICP(unouno)(fram1)(fakeContext);

      expect(testProbe.centerX).to.be.equal(0);
      expect(testProbe.centerY).to.be.equal(25);
    });

    it('a segments_painterSICP that maps frames into DOM canvas, adapting the coordinates', function () {

      var origin = V.make_vect(-100, 25);
      var edge1 = V.make_vect(0, 50);
      var edge2 = V.make_vect(-100, 0);
      var fram1 = P.make_frame(origin, edge1, edge2);

      var testProbe = probe();
      var fakeContext = fakeCtx()(testProbe); // canvas 400x200

      // drawing a diagonal from frame origin to opposite corner
      P.segments_painterSICP([P.make_segment(V.make_vect(0, 0), V.make_vect(1, 1))])(fram1)(fakeContext);

      expect(testProbe.startX).to.be.equal(100);
      expect(testProbe.startY).to.be.equal(75);
      expect(testProbe.endX).to.be.equal(0);
      expect(testProbe.endY).to.be.equal(25);
    });

  });

  describe('painters that use the native origin and coordinates of a canvas, like', () => {
    describe('a single_dot_painter that takes a point in a frame and converts its coordinates into DOM canvas pixel coords', function () {
      it('for translated frames', () => {
        var origin = V.make_vect(100, 25);
        var edge1 = V.make_vect(100, 0);
        var edge2 = V.make_vect(0, 100);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painter(origgio)(fram1)(fakeContext);

        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);
        expect(testProbe.radius).to.be.equal(1);

        // drawing a point at (1,1) in the frame reference
        var unouno = V.make_vect(1, 1);
        P.single_dot_painter(unouno)(fram1)(fakeContext);

        expect(testProbe.centerX).to.be.equal(200);
        expect(testProbe.centerY).to.be.equal(125);

      });

      it('for rotated frames', () => {
        var origin = V.make_vect(100, 25);
        var edge1 = V.make_vect(100, 100);
        var edge2 = V.make_vect(-100, 100);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painter(origgio)(fram1)(fakeContext);

        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);
        expect(testProbe.radius).to.be.equal(1);

        // drawing a point at (1,1) in the frame reference
        var unouno = V.make_vect(1, 1);
        P.single_dot_painter(unouno)(fram1)(fakeContext);

        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(225);
      });

    });

    it('a segments painter that maps frames into DOM canvas, adapting the coordinates', function () {

      var origin = V.make_vect(100, 25);
      var edge1 = V.make_vect(100, 0);
      var edge2 = V.make_vect(0, 100);
      var fram1 = P.make_frame(origin, edge1, edge2);

      var testProbe = probe();
      var fakeContext = fakeCtx()(testProbe); // canvas 400x200

      // drawing a diagonal from frame origin to opposite corner
      P.segments_painter([P.make_segment(V.make_vect(0, 0), V.make_vect(1, 1))])(fram1)(fakeContext);

      expect(testProbe.startX).to.be.equal(100);
      expect(testProbe.startY).to.be.equal(25);
      expect(testProbe.endX).to.be.equal(200);
      expect(testProbe.endY).to.be.equal(125);

    });

    describe('a text_painter that draws a text at the right DOM canvas pixel coords', function () {

      it('while the text is specified in a traslated frame', () => {
        var origin = V.make_vect(100, 25);
        var edge1 = V.make_vect(100, 0);
        var edge2 = V.make_vect(0, 100);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a text in the frame origin
        var testo = {
          text: 'lorem ipsum',
          font: '30px Arial',
          position: V.make_vect(0, 0),
        };
        P.text_painter(testo)(fram1)(fakeContext);

        expect(testProbe.textPosX).to.be.equal(100);
        expect(testProbe.textPosY).to.be.equal(25);
        expect(testProbe.text).to.be.equal('lorem ipsum');
        //expect(fakeContext.font).to.be.equal('30px Arial');

        // drawing a text at (1,1) in the frame reference
        testo.position = V.make_vect(1, 1);
        P.text_painter(testo)(fram1)(fakeContext);

        expect(testProbe.textPosX).to.be.equal(200);
        expect(testProbe.textPosY).to.be.equal(125);
      });

      it('while the text is specified in a rotated frame', () => {

        // edges at PI/4 clockwise
        var origin = V.make_vect(100, 25);
        let rotation = V.rotation_matrix(Math.PI / 4);
        var edge1 = V.rotate_vect(V.make_vect(100, 0), rotation);
        var edge2 = V.rotate_vect(V.make_vect(0, 100), rotation);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a text in the frame origin
        var testo = {
          text: 'lorem ipsum',
          font: '30px Arial',
          position: V.make_vect(0, 0),
        };
        P.text_painter(testo)(fram1)(fakeContext);

        expect(testProbe.textPosX).to.be.equal(100);
        expect(testProbe.textPosY).to.be.equal(25);
        expect(testProbe.text).to.be.equal('lorem ipsum');
        //expect(fakeContext.font).to.be.equal('30px Arial');

        // drawing a text at (1,1) in the frame reference
        testo.position = V.make_vect(1, 1);
        P.text_painter(testo)(fram1)(fakeContext);

        expect(testProbe.textPosX).to.be.closeTo(100, 1e-5);
        expect(testProbe.textPosY).to.be.closeTo(166.42135, 1e-5);
        expect(testProbe.textPosY).to.be.closeTo(166.42135, 1e-5);
      });

    });
  });

  describe('a flip_vert painter that flips another painter around its x-axis', () => {
    describe('in a y-upward, canvas-center as origin frame of reference', () => {
      it('when the local x-axis is not rotated', () => {

        var origin = V.make_vect(-100, 25);
        var edge1 = V.make_vect(100, 0);
        var edge2 = V.make_vect(0, 50);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painterSICP(origgio)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(75);

        P.flip_vert(P.single_dot_painterSICP(origgio))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);

        // drawing a point in (1,1)
        let unouno = V.make_vect(1, 1);
        P.single_dot_painterSICP(unouno)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(200);
        expect(testProbe.centerY).to.be.equal(25);

        P.flip_vert(P.single_dot_painterSICP(unouno))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(200);
        expect(testProbe.centerY).to.be.equal(75);
      });

      it('when the local x-axis is rotated 90deg', () => {

        var origin = V.make_vect(-100, 25);
        var edge1 = V.make_vect(0, 50);
        var edge2 = V.make_vect(-100, 0);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painterSICP(origgio)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(75);

        P.flip_vert(P.single_dot_painterSICP(origgio))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(0);
        expect(testProbe.centerY).to.be.equal(75);

        // drawing a point in (1,1)
        let unouno = V.make_vect(1, 1);
        P.single_dot_painterSICP(unouno)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(0);
        expect(testProbe.centerY).to.be.equal(25);

        P.flip_vert(P.single_dot_painterSICP(unouno))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);
      });
    });

    describe('in a y-downward canvas with top-left corner as origin frame of reference', () => {
      it('when the local x-axis is not rotated', () => {

        var origin = V.make_vect(-100, 25);
        var edge1 = V.make_vect(100, 0);
        var edge2 = V.make_vect(0, 50);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painterSICP(origgio)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(75);

        P.flip_vert(P.single_dot_painterSICP(origgio))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);

        // drawing a point in (1,1)
        let unouno = V.make_vect(1, 1);
        P.single_dot_painterSICP(unouno)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(200);
        expect(testProbe.centerY).to.be.equal(25);

        P.flip_vert(P.single_dot_painterSICP(unouno))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(200);
        expect(testProbe.centerY).to.be.equal(75);
      });

      it('when the local x-axis is rotated 90deg', () => {

        var origin = V.make_vect(-100, 25);
        var edge1 = V.make_vect(0, 50);
        var edge2 = V.make_vect(-100, 0);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painterSICP(origgio)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(75);

        P.flip_vert(P.single_dot_painterSICP(origgio))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(0);
        expect(testProbe.centerY).to.be.equal(75);

        // drawing a point in (1,1)
        let unouno = V.make_vect(1, 1);
        P.single_dot_painterSICP(unouno)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(0);
        expect(testProbe.centerY).to.be.equal(25);

        P.flip_vert(P.single_dot_painterSICP(unouno))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);
      });
    });
  });

  describe('a flip_horiz painter that flips another painter around its y-axis', () => {
    describe('in a y-downward canvas with top-left corner as origin frame of reference', () => {
      it('when the local x-axis is not rotated', () => {

        var origin = V.make_vect(100, 25);
        var edge1 = V.make_vect(100, 0);
        var edge2 = V.make_vect(0, 50);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painter(origgio)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);

        P.flip_horiz(P.single_dot_painter(origgio))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(200);
        expect(testProbe.centerY).to.be.equal(25);

        // drawing a point in (1,1)
        let unouno = V.make_vect(1, 1);
        P.single_dot_painter(unouno)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(200);
        expect(testProbe.centerY).to.be.equal(75);

        P.flip_horiz(P.single_dot_painter(unouno))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(75);
      });

      it('when the local x-axis is rotated 90deg', () => {

        var origin = V.make_vect(100, 25);
        var edge1 = V.make_vect(0, 50);
        var edge2 = V.make_vect(-100, 0);
        var fram1 = P.make_frame(origin, edge1, edge2);

        var testProbe = probe();
        var fakeContext = fakeCtx()(testProbe); // canvas 400x200

        // drawing a point in the frame origin
        var origgio = V.make_vect(0, 0);
        P.single_dot_painter(origgio)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(25);

        P.flip_horiz(P.single_dot_painter(origgio))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(100);
        expect(testProbe.centerY).to.be.equal(75);

        // drawing a point in (1,1)
        let unouno = V.make_vect(1, 1);
        P.single_dot_painter(unouno)(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(0);
        expect(testProbe.centerY).to.be.equal(75);

        P.flip_horiz(P.single_dot_painter(unouno))(fram1)(fakeContext);
        expect(testProbe.centerX).to.be.equal(0);
        expect(testProbe.centerY).to.be.equal(25);
      });
    });
  });

});
