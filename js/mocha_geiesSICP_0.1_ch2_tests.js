/*
	GEIESSICP - JS implementations from SICP
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1 - depends on Geieslists 1.1

	The MIT License - Copyright (c) 2016 GeiesSICP Project
*/var expect = chai.expect;

describe('Implementing SICP chapter 2 brings to the realization of', function () {
  var nil = L.nil;
  
  it('a function to build sets as trees in a naive manner', function() {

    expect(S.build_set_naive(L.ArrayToList(['a'])).c).to.be.equal('[a,[],[]]');
    expect(S.build_set_naive(L.ArrayToList(['a','a'])).c).to.be.equal('[a,[],[]]');
    expect(S.build_set_naive(L.ArrayToList(['a','b'])).c).to.be.equal('[a,[],[b,[],[]]]');
    expect(S.build_set_naive(L.ArrayToList(['a','a','b'])).c).to.be.equal('[a,[],[b,[],[]]]');
    expect(S.build_set_naive(L.ArrayToList(['a','b','b'])).c).to.be.equal('[a,[],[b,[],[]]]');
    expect(S.build_set_naive(L.ArrayToList(['a','b','a'])).c).to.be.equal('[a,[],[b,[],[]]]');
    expect(S.build_set_naive(L.ArrayToList(['a','b','b','a'])).c).to.be.equal('[a,[],[b,[],[]]]');
    expect(S.build_set_naive(L.ArrayToList(['b','a'])).c).to.be.equal('[b,[a,[],[]],[]]');
    expect(S.build_set_naive(L.ArrayToList(['b','a','a','b','b','a'])).c).to.be.equal('[b,[a,[],[]],[]]');
    expect(S.build_set_naive(L.ArrayToList(['m','a','r','c'])).c).to.be.equal('[m,[a,[],[c,[],[]]],[r,[],[]]]');
    expect(S.build_set_naive(
	  L.ArrayToList(['s','u','b','d','e','r','m','a','t','o','g','l','y','p','h','i','c'])).c).to.be.equal(
	  '[s,[b,[a,[],[]],[d,[c,[],[]],[e,[],[r,[m,[g,[],[l,[h,[],[i,[],[]]],[]]],[o,[],[p,[],[]]]],[]]]]],[u,[t,[],[]],[y,[],[]]]]');

  });

  it('a function to measure the depth of trees', function() {

    expect(S.depth(S.build_set_naive(L.ArrayToList(['a'])))).to.be.equal(1);
    expect(S.depth(S.build_set_naive(L.ArrayToList(['a','b'])))).to.be.equal(2);
    expect(S.depth(S.build_set_naive(L.ArrayToList(['m','a','r','c'])))).to.be.equal(3);
    expect(S.depth(S.build_set_naive(
    L.ArrayToList(['s','u','b','d','e','r','m','a','t','o','g','l','y','p','h','i','c'])))).to.be.equal(10);

  });

  it('a function element_of_set', function() {
    // NB next tree must be ordered!
    var tree = S.make_tree('m',S.make_tree('a',L.nil,S.make_tree('r',S.make_tree('c',L.nil,L.nil),L.nil)),L.nil);
    expect(S.element_of_set('c',tree)).to.be.ok;
    expect(S.element_of_set('b',tree)).to.be.not.ok;
  });

  it('two functions to flatten binary trees', function() {
    var tree6 = S.make_tree('x',L.nil,L.nil)
    expect(S.tree_to_list1(tree6).c).to.be.equal('[x]');
    var tree7 = S.make_tree('x',S.make_tree('y',L.nil,L.nil),L.nil)
    expect(S.tree_to_list1(tree7).c).to.be.equal('[y,x]');
    var tree8 = S.make_tree('x',S.make_tree('y',L.nil,L.nil),S.make_tree('z',L.nil,L.nil))
    expect(S.tree_to_list1(tree8).c).to.be.equal('[y,x,z]');
    var tree9 = S.make_tree('m',S.make_tree('a',L.nil,S.make_tree('r',S.make_tree('c',L.nil,L.nil),L.nil)),L.nil);
    expect(S.tree_to_list1(tree9).c).to.be.equal('[a,c,r,m]');

    var tree1 = S.make_tree('x',L.nil,L.nil)
    expect(S.tree_to_list2(tree1).c).to.be.equal('[x]');
    var tree2 = S.make_tree('x',S.make_tree('y',L.nil,L.nil),L.nil)
    expect(S.tree_to_list2(tree2).c).to.be.equal('[x,y]');
    var tree3 = S.make_tree('x',S.make_tree('y',L.nil,L.nil),S.make_tree('z',L.nil,L.nil))
    expect(S.tree_to_list2(tree3).c).to.be.equal('[x,y,z]');
    var tree4 = S.make_tree('m',S.make_tree('a',L.nil,S.make_tree('r',S.make_tree('c',L.nil,L.nil),L.nil)),L.nil);
    expect(S.tree_to_list2(tree4).c).to.be.equal('[m,a,r,c]');
    });

  it('a function to build sets as balanced trees', function() {
    //var gigio = S.build_balanced_tree(L.ArrayToList([/*'a','b',*/'c','d','e','f']));
    //debugger;
    expect(S.build_balanced_tree(L.ArrayToList(['a'])).c).to.be.equal('[a,[],[]]');
    expect(S.build_balanced_tree(L.ArrayToList(['a','b'])).c).to.be.equal('[a,[],[b,[],[]]]');
    expect(S.build_balanced_tree(L.ArrayToList(['b','a'])).c).to.be.equal('[a,[],[b,[],[]]]');
    expect(S.build_balanced_tree(L.ArrayToList(['m','a','r','c'])).c).to.be.equal('[c,[a,[],[]],[m,[],[r,[],[]]]]');
    expect(S.build_balanced_tree(
	  L.ArrayToList(['s','u','b','d','e','r','m','a','t','o','g','l','y','p','h','i','c'])).c).to.be.equal(
	  '[l,[d,[b,[a,[],[]],[c,[],[]]],[g,[e,[],[]],[h,[],[i,[],[]]]]],[r,[o,[m,[],[]],[p,[],[]]],[t,[s,[],[]],[u,[],[y,[],[]]]]]]');

    expect(S.depth(S.build_set_naive(
    L.ArrayToList(['s','u','b','d','e','r','m','a','t','o','g','l','y','p','h','i','c'])))).to.be.equal(10);
    expect(S.depth(S.build_balanced_tree(
    L.ArrayToList(['s','u','b','d','e','r','m','a','t','o','g','l','y','p','h','i','c'])))).to.be.equal(5);
  });

  it('a function to navigate Huffman trees', function() {
    var a = L.ArrayToList([['a'],6,[],[]]);
    var b = L.ArrayToList([['b'],3,[],[]]);
    var c = L.ArrayToList([['c'],1,[],[]]);
    var d = L.ArrayToList([['d'],1,[],[]]);
    var e = L.ArrayToList([['e'],2,[],[]]);
    var cd = L.ArrayToList([['c','d'],2,c,d]);
    var cde = L.ArrayToList([['c','d','e'],4,cd,e]);
    var bcde = L.ArrayToList([['b','c','d','e'],7,b,cde]);
    var abcde = L.ArrayToList([['a','b','c','d','e'],13,a,bcde]);

    expect(S.decodeH('0',abcde)).to.be.equal('a');
    expect(S.decodeH('10',abcde)).to.be.equal('b');
    expect(S.decodeH('1101',abcde)).to.be.equal('d');
    
  });

  it('a function to build Huffman trees', function() {
    var a = L.ArrayToList([['a'],6,[],[]]);
    var b = L.ArrayToList([['b'],3,[],[]]);
    var c = L.ArrayToList([['c'],1,[],[]]);
    var d = L.ArrayToList([['d'],1,[],[]]);
    var e = L.ArrayToList([['e'],2,[],[]]);
    var cd = L.ArrayToList([['c','d'],2,c,d]);
    var cde = L.ArrayToList([['c','d','e'],4,cd,e]);
    var bcde = L.ArrayToList([['b','c','d','e'],7,b,cde]);
    var abcde = L.ArrayToList([['a','b','c','d','e'],13,a,bcde]);
    
    var as = [['a'],6];
    var bs = [['b'],3];
    var cs = [['c'],1];
    var ds = [['d'],1];
    var es = [['e'],2];

    var symbols_cd = L.ArrayToList([cs,ds]);
    expect(S.buildH(symbols_cd).c).to.be.equal(cd.c);

    var symbols_cde = L.ArrayToList([cs,ds,es]);
    expect(S.buildH(symbols_cde).c).to.be.equal(cde.c);

    var symbols_bcde = L.ArrayToList([bs,cs,ds,es]);
    expect(S.buildH(symbols_bcde).c).to.be.equal(bcde.c);

    var symbols_abcde = L.ArrayToList([as,bs,cs,ds,es]);
    expect(S.buildH(symbols_abcde).c).to.be.equal(abcde.c);    
  });

  it('a function to build unordered Huffman dictionaries', function() {
    expect(S.dictionaryH('a').c).to.be.equal('[[[a],1]]');
    expect(S.dictionaryH('a ').c).to.be.equal('[[[a],1]]');
    expect(S.dictionaryH('ab').c).to.be.equal('[[[b],1],[[a],1]]');
    expect(S.dictionaryH('a b').c).to.be.equal('[[[b],1],[[a],1]]');
    expect(S.dictionaryH('aba').c).to.be.equal('[[[b],1],[[a],2]]');
    expect(S.dictionaryH('abacba').c).to.be.equal('[[[c],1],[[b],2],[[a],3]]');
    expect(S.dictionaryH('The quick brown fox jumps over the lazy dog').c).to.be.equal('[[[g],1],[[d],1],[[y],1],[[z],1],[[a],1],[[l],1],[[t],1],[[v],1],[[s],1],[[p],1],[[m],1],[[j],1],[[x],1],[[f],1],[[n],1],[[w],1],[[o],4],[[r],2],[[b],1],[[k],1],[[c],1],[[i],1],[[u],2],[[q],1],[[e],3],[[h],2],[[T],1]]');
  });
});
