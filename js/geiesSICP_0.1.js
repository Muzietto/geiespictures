/*
	GEIESSICP - JS implementations from SICP
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1 - depends on Geieslists 1.1

	The MIT License - Copyright (c) 2016 GeiesSICP Project
*/
var geiessicp = S = function(L) {
  
  var nil = L.nil;
  var isEmpty = L.isEmpty;

  // sets
  function make_tree(entry, left, right) { return L.ArrayToList([entry,left,right]); }

  var entry = L.first;
  var left_branch = L.second;
  var right_branch = L.third;

  function depth(tree) {
    if (isEmpty(tree)) return 0;
    return 1 + Math.max(depth(left_branch(tree)), depth(right_branch(tree)));
  }

  function build_set_naive(elements) {
    return build_set_helper(elements, nil);
    function build_set_helper(list, tree) {
      if (isEmpty(list)) return tree;
      if (element_of_set(L.head(list), tree)) return build_set_helper(L.tail(list), tree);
      return build_set_helper(L.tail(list), adjoin_set(L.head(list), tree));
    }
  }

  function tree_to_list1(tree) {
    if (isEmpty(tree)) return nil;
    return L.concat(tree_to_list1(left_branch(tree)),L.cons(entry(tree),tree_to_list1(right_branch(tree))));
  }

  function tree_to_list2(tree) {
    return L.reverse(tree_to_list_helper(tree, nil));
    
    function tree_to_list_helper(tree, list) {
      if (isEmpty(tree)) return list;
      return tree_to_list_helper(right_branch(tree), tree_to_list_helper(left_branch(tree),L.cons(entry(tree),list)));
    }
  }

  function adjoin_set(x, set) {
    if (isEmpty(set)) return make_tree(x, nil, nil);
    var currEntry = entry(set);
    if (x < currEntry) return make_tree(currEntry, adjoin_set(x, left_branch(set)), right_branch(set));
    if (x > currEntry) return make_tree(currEntry, left_branch(set), adjoin_set(x, right_branch(set)));
  }

  function element_of_set(x, set) {
    if (isEmpty(set)) return false;
    if (x === entry(set)) return true;
    if (x < entry(set)) return element_of_set(x, left_branch(set));
    if (x > entry(set)) return element_of_set(x, right_branch(set));
  }

  function build_balanced_tree(elements) {
    return L.head(partial_tree(L.sort(elements), L.size(elements)));

    function partial_tree(elts, n) {
      if (n === 0) return L.cons(nil, elts);
      var left_size = Math.floor((n - 1) / 2);
      var left_result = partial_tree(elts, left_size);
      var left_tree = L.head(left_result);
      var non_left_elts = L.tail(left_result);
      var right_size = n - (left_size+1);
      var this_entry = L.head(non_left_elts);
      var right_result = partial_tree(L.tail(non_left_elts), right_size);
      var right_tree = L.head(right_result);
      var remaining_elts = L.tail(right_result);
      return L.cons(make_tree(this_entry, left_tree,right_tree), remaining_elts);
    }
  }

  // Huffman trees
  function decodeH (encoded,tree) {
    var symbols = L.first;
    var weight = L.second;
    var left_branch = L.third;
    var right_branch = L.fourth;

    var bits = L.ArrayToList(encoded.split('').filter(function(x) { return (x === '1' || x === '0');}));
    return decode(bits, tree);

    function decode(bits,tree) {
      if (L.size(bits) === 0) {
        if (L.size(L.head(tree)) === 1) {
          return L.head(L.head(tree));
        } else {
          throw new Error('non-existing encoding 1!');
        }
      }
      var currentBit = L.head(bits);
      if (currentBit === '0') return decode(L.tail(bits), left_branch(tree));
      if (currentBit === '1') return decode(L.tail(bits), right_branch(tree));
      throw new Error('non-existing encoding 2!')
    }
  }

  function buildH(symbols) {
    var enrichedSymbols = L.map(symbols, function(symbol) {
      return L.concat(symbol, L.ArrayToList([[],[]]));
    });
    return HtreeBuilder(enrichedSymbols);      
    
    function HtreeBuilder(nodes) {
      if (L.size(nodes) === 1) return L.head(nodes);
      var sortedNodes = L.sort(nodes, symbolsComparator);
      return HtreeBuilder(L.cons(make_parentH(L.first(sortedNodes), L.second(sortedNodes)), L.tail(L.tail(sortedNodes))));
    }
    function make_parentH(sa, sb) {
      var symbolsA = L.first(sa), symbolsB = L.first(sb), weightA = L.second(sa), weightB = L.second(sb);
      return L.ArrayToList([L.concat(symbolsA, symbolsB), weightA + weightB, sa, sb]);
    }
    function symbolsComparator(sa, sb) {
      var weightA = L.second(sa), weightB = L.second(sb);
      if (weightA === weightB) return 0;
      if (weightA > weightB) return 1;
      return -1;
    }
  }
  
  function dictionaryH(string) {
    return L.foldl(
      function(acc, x) {
        if (inDictionary(x, acc)) return increaseCount(x, acc);
        else return L.cons(L.ArrayToList([[x], 1]), acc);
      },
      nil,
      L.ArrayToList(string.split('').filter(function(x){return x !== ' ';})));

    function inDictionary(x, dict) {
      return L.isMember(x, dict, function(a, b) {
        return (a === L.head(L.head(b)));
      });
    }
    function increaseCount(x, dict) {
      return L.map(dict, function(item) {
        if (x === L.head(L.first(item))) return L.ArrayToList([L.first(item), L.second(item) + 1]);
        else return item;
      });
    };
  }

  return {
      make_tree: make_tree,
      entry: entry,
      left_branch: left_branch,
      right_branch: right_branch,
      depth: depth,
      build_set_naive: build_set_naive,
      element_of_set: element_of_set,
      adjoin_set: adjoin_set,
      tree_to_list1: tree_to_list1,
      tree_to_list2: tree_to_list2,
      build_balanced_tree: build_balanced_tree,
      decodeH: decodeH,
      buildH: buildH,
      dictionaryH, dictionaryH
  };
}(geieslists);
