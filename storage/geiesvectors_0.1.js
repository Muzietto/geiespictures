var V = function(L) {
  function make_vect(x, y) { return L.cons(x, L.cons(y,L.nil)); }
  function xcor_vect(v) { return L.car(v) }
  function ycor_vect(v) { return L.car(L.cdr(v)) }
  function add_vect(v1, v2) { return make_vect(xcor_vect(v1)+xcor_vect(v2), ycor_vect(v1)+ycor_vect(v2)) }



  return {
    make_vect: make_vect,
    xcor_vect: xcor_vect,
    ycor_vect: ycor_vect,
    add_vect: add_vect
  }
}(L)
