var V = function(L) {
  var make_vect = (x, y) => L.ArrayToList([x, y]);
  var xcor_vect = L.first;
  var ycor_vect = L.second;
  var length_vect = v => Math.sqrt(Math.pow(xcor_vect(v),2) + Math.pow(ycor_vect(v),2))
  var add_vect = (v1, v2) => make_vect(xcor_vect(v1) + xcor_vect(v2), ycor_vect(v1) + ycor_vect(v2));
  var sub_vect = (v1, v2) => make_vect(xcor_vect(v1) - xcor_vect(v2), ycor_vect(v1) - ycor_vect(v2));
  var scale_vect = (v, s) => make_vect(s * xcor_vect(v), s * ycor_vect(v));
  var transf_matrix = (m11, m12, m13, m21, m22, m23, m31, m32, m33) => {
    return {
      _11: () => m11,
      _12: () => m12,
      _13: () => m13,
      _21: () => m21,
      _22: () => m22,
      _23: () => m23,
      _31: () => m31,
      _32: () => m32,
      _33: () => m33
    };
  };
  var mult_matrix = (m1, m2) => transf_matrix(
    m1._11()*m2._11() + m1._12()*m2._21() + m1._13()*m2._31(), // _11
    m1._11()*m2._12() + m1._12()*m2._22() + m1._13()*m2._32(), // _12
    m1._11()*m2._13() + m1._12()*m2._23() + m1._13()*m2._33(), // _13
    m1._21()*m2._11() + m1._22()*m2._21() + m1._23()*m2._31(), // _21
    m1._21()*m2._12() + m1._22()*m2._22() + m1._23()*m2._32(), // _22
    m1._21()*m2._13() + m1._22()*m2._23() + m1._23()*m2._33(), // _23
    m1._31()*m2._11() + m1._32()*m2._21() + m1._33()*m2._31(), // _31
    m1._31()*m2._12() + m1._32()*m2._22() + m1._33()*m2._32(), // _32
    m1._31()*m2._13() + m1._32()*m2._23() + m1._33()*m2._33()  // _33
  );
  
  return {
    make_vect: make_vect,
    xcor_vect: xcor_vect,
    ycor_vect: ycor_vect,
    length_vect: length_vect,
    add_vect: add_vect,
    sub_vect: sub_vect,
    scale_vect: scale_vect,
    transf_matrix: transf_matrix,
    mult_matrix: mult_matrix
  }
}(L);
