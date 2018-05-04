var V = geiesvectors = function (L) {

  var make_vect = (x, y) => L.ArrayToList([x, y]);
  var xcor_vect = L.first;
  var ycor_vect = L.second;

  var length_vect = v => Math.sqrt(Math.pow(xcor_vect(v), 2) + Math.pow(ycor_vect(v), 2));

  var inverse_vect = v => make_vect(-xcor_vect(v), -ycor_vect(v));
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
      _33: () => m33,
      isMatrix: true,
    };
  };

  var add_matrix = (m1, m2) => transf_matrix(
    m1._11() + m2._11(), // _11
    m1._12() + m2._12(), // _12
    m1._13() + m2._13(), // _13
    m1._21() + m2._21(), // _21
    m1._22() + m2._22(), // _22
    m1._23() + m2._23(), // _23
    m1._31() + m2._31(), // _31
    m1._32() + m2._32(), // _32
    m1._33() + m2._33()  // _33
  );

  var mult_matrix = (m1, m2) => transf_matrix(
    m1._11() * m2._11() + m1._12() * m2._21() + m1._13() * m2._31(), // _11
    m1._11() * m2._12() + m1._12() * m2._22() + m1._13() * m2._32(), // _12
    m1._11() * m2._13() + m1._12() * m2._23() + m1._13() * m2._33(), // _13
    m1._21() * m2._11() + m1._22() * m2._21() + m1._23() * m2._31(), // _21
    m1._21() * m2._12() + m1._22() * m2._22() + m1._23() * m2._32(), // _22
    m1._21() * m2._13() + m1._22() * m2._23() + m1._23() * m2._33(), // _23
    m1._31() * m2._11() + m1._32() * m2._21() + m1._33() * m2._31(), // _31
    m1._31() * m2._12() + m1._32() * m2._22() + m1._33() * m2._32(), // _32
    m1._31() * m2._13() + m1._32() * m2._23() + m1._33() * m2._33()  // _33
  );

  var translation_matrix = (tx, ty) => transf_matrix(1, 0, tx, 0, 1, ty, 0, 0, 1);

  var scaling_matrix = (sx, sy) => transf_matrix(sx, 0, 0, 0, sy, 0, 0, 0, 1);

  var rotation_matrix = (radians) => {
    var result = transf_matrix(Math.cos(radians), -Math.sin(radians), 0,
      Math.sin(radians), Math.cos(radians), 0,
      0, 0, 1);
    return result;
  };

  var angle_vect = vect => {
    var result = Math.atan(ycor_vect(vect) / xcor_vect(vect));
    if (xcor_vect(vect) < 0) result = result + Math.PI;
    return result;
  };

  var _prod_matrix_vect = (m1, v) => make_vect(
    m1._11() * xcor_vect(v) + m1._12() * ycor_vect(v),
    m1._21() * xcor_vect(v) + m1._22() * ycor_vect(v)
  );

  var rotate_vect = (vector, direction) => {
    var rotationMatrix = (direction.isMatrix) ? direction : rotation_matrix(angle_vect(direction));
    var rotatedVector = _prod_matrix_vect(rotationMatrix, vector);
    return rotatedVector;
  };

  var align_vect = (vector, direction) => {
    var length = length_vect(vector);
    var radians = angle_vect(direction);
    return make_vect(length * Math.cos(radians), length * Math.sin(radians));
  };

  return {
    make_vect: make_vect,
    xcor_vect: xcor_vect,
    ycor_vect: ycor_vect,
    length_vect: length_vect,
    inverse_vect: inverse_vect,
    add_vect: add_vect,
    sub_vect: sub_vect,
    scale_vect: scale_vect,
    rotate_vect: rotate_vect,
    align_vect: align_vect,
    transf_matrix: transf_matrix,
    add_matrix: add_matrix,
    mult_matrix: mult_matrix,
    translation_matrix: translation_matrix,
    scaling_matrix: scaling_matrix,
    rotation_matrix: rotation_matrix,
    angle_vect: angle_vect
  };
}(L);
