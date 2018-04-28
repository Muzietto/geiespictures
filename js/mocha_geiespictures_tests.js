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
  return {};
};

var fakeCtx = () => probe => {
  return {
    canvas: {
      clientWidth: 400,
      clientHeight: 200
    },
    resetTransform: () => {
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

  it('a series of vector operations that allow to measure, sum, subtract, scale, rotate and align  vectors', function () {
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
    var deg75 = V.rotate_vect(deg30, deg45);
    expect(V.length_vect(deg75)).to.be.gt(0.999);
    expect(V.length_vect(deg75)).to.be.lt(1.001);
    expect((V.angle_vect(deg75) / 7.5) * 18).to.be.lt(3.141593);
    expect((V.angle_vect(deg75) / 7.5) * 18).to.be.gt(3.141592);

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
    var mappedUnit = coordinateMapper1(unitVec);
    var mappedTest = coordinateMapper1(testVec);

    expect(mappedUnit.c).to.be.equal('[0,7]');
    expect(mappedTest.c).to.be.equal('[3,13]');
  });
  it('a segments painter that maps frames into DOM canvas, adapting the coordinates', function () {
    var origin = V.make_vect(-100, 25);
    var edge1 = V.make_vect(0, 50);
    var edge2 = V.make_vect(-100, 0);
    var fram1 = P.make_frame(origin, edge1, edge2);

    var testProbe = probe();
    var fakeContext = fakeCtx()(testProbe);

    // drawing a diagonal from frame origin to opposite corner
    P.segments_painter([P.make_segment(V.make_vect(0, 0), V.make_vect(1, 1))])(fram1)(fakeContext);

    expect(testProbe.startX).to.be.equal(100);
    expect(testProbe.startY).to.be.equal(75);
    expect(testProbe.endX).to.be.equal(0);
    expect(testProbe.endY).to.be.equal(25);
  });
});
