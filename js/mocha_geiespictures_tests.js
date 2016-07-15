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

var probe = () => { return {}; }

var fakeCtx = () => probe => { return {
    canvas: {
        clientWidth: 400,
        clientHeight: 200
    },
    beginPath: () => {},
    moveTo: (x,y) => { probe.startX = x; probe.startY = y; },
    lineTo: (x,y) => { probe.endX = x; probe.endY = y; },
    stroke: () => {}
    };
};

describe('a sound picture system requires', function () {

  it('a series of vector operations that allow to sum, subtract and scale vectors', function() {

    var pippo = V.make_vect(-3,1);
    var pluto = V.make_vect(-2,3);
    var luigi = V.add_vect(pippo, pluto);
    var luigi2 = V.sub_vect(pippo, pluto);
    expect(luigi.c).to.be.equal('[-5,4]');
    expect(luigi2.c).to.be.equal('[-1,-2]');
    expect(V.length_vect(pippo)).to.be.gt(3.16);
    expect(V.length_vect(pippo)).to.be.lt(3.17);

  });
  it('definitions for fold left and right', function() {

    expect(L.fold((x,ys)=>x+ys,0,L.ArrayToList([1,3,5]))).to.be.equal(9);
    expect(L.foldl((acc,x)=>acc+x,0,L.ArrayToList([1,3,6]))).to.be.equal(10);

  });

});
describe('a sound picture system entails', function () {

  it('functions to handle frames', function() {

    var origin = V.make_vect(-3,1);
    var edge1 = V.make_vect(5,3);
    var edge2 = V.make_vect(-2,3);
    var fram1 = P.make_frame(origin, edge1, edge2);

    expect(P.origin_frame(fram1).c).to.be.equal('[-3,1]');
    expect(P.edge1_frame(fram1).c).to.be.equal('[5,3]');
    expect(P.edge2_frame(fram1).c).to.be.equal('[-2,3]');

  });
  it('a coordinateMapper', function() {

    var origin = V.make_vect(-3,1);
    var edge1 = V.make_vect(5,3);
    var edge2 = V.make_vect(-2,3);
    var fram1 = P.make_frame(origin, edge1, edge2);

    var coordinateMapper1 = P.frame_coord_map(fram1);
    var unitVec = V.make_vect(1,1);
    var testVec = V.make_vect(2,2);
    var mappedUnit = coordinateMapper1(unitVec);
    var mappedTest = coordinateMapper1(testVec);

    expect(mappedUnit.c).to.be.equal('[0,7]');
    expect(mappedTest.c).to.be.equal('[3,13]');

  });
  it('a segments painter that maps frames into DOM canvas, adapting the coordinates', function() {

    var origin = V.make_vect(-100,25);
    var edge1 = V.make_vect(0,50);
    var edge2 = V.make_vect(-100,0);
    var fram1 = P.make_frame(origin, edge1, edge2);

    var testProbe = probe();
    var fakeContext = fakeCtx()(testProbe)

    // drawing a diagonal from frame origin to opposite corner
    P.segments_painter([P.make_segment(V.make_vect(0,0),V.make_vect(1,1))])(fram1)(fakeContext);

    expect(testProbe.startX).to.be.equal(100);
    expect(testProbe.startY).to.be.equal(75);
    expect(testProbe.endX).to.be.equal(0);
    expect(testProbe.endY).to.be.equal(25);

  });
});
