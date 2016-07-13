
var pippo = V.make_vect(-3,1);
var pluto = V.make_vect(-2,3);
var luigi = V.add_vect(pippo, pluto);
var luigi2 = V.sub_vect(pippo, pluto);
console.log(luigi.c)
console.log(luigi2.c)
console.log(L.fold((x,ys)=>x+ys,0,L.ArrayToList([1,3,5])))
console.log(L.foldl((acc,x)=>acc+x,0,L.ArrayToList([1,3,6])))

var origin = V.make_vect(-3,1);
var edge1 = V.make_vect(5,3);
var edge2 = V.make_vect(-2,3);

var fram1 = P.make_frame(origin, edge1, edge2);
console.log(P.origin_frame(fram1).c);
console.log(P.edge1_frame(fram1).c);
console.log(P.edge2_frame(fram1).c);

var coordinateMapper1 = P.frame_coord_map(fram1);
var testVec = V.make_vect(2,2);
var mappedTest = coordinateMapper1(testVec);

console.log(mappedTest.c);
