/*
	GEIESPICTURES - the 
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1

	The MIT License - Copyright (c) 2016 Geiespictures Project
*/

var expect = chai.expect;

describe('a sound picture system requires', function () {

  it('a series of vector operations that allow to sum, subtract and scale vectors', function() {
//		expect(head(head(listlA_BA))).to.be.equal('a');
//		expect(isEmpty(tail(head(listlA_BA)))).to.be.ok;
//		expect(isEmpty(tail(EMPTY))).to.be.not.ok;

    var pippo = V.make_vect(-3,1);
    var pluto = V.make_vect(-2,3);
    var luigi = V.add_vect(pippo, pluto);
    var luigi2 = V.sub_vect(pippo, pluto);
    expect(luigi.c).to.be.equal('[-5,4]');
    expect(luigi2.c).to.be.equal('[-1,-2]');
      
  });
  it('definitions for fold left and right', function() {
    
    expect(L.fold((x,ys)=>x+ys,0,L.ArrayToList([1,3,5]))).to.be.equal(9);
    expect(L.foldl((acc,x)=>acc+x,0,L.ArrayToList([1,3,6]))).to.be.equal(10);
      
  });

});
describe('a sound picture system entails', function () {

  it('functions to handle frames', function() {
//		expect(head(head(listlA_BA))).to.be.equal('a');
//		expect(isEmpty(tail(head(listlA_BA)))).to.be.ok;
//		expect(isEmpty(tail(EMPTY))).to.be.not.ok;

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

});
