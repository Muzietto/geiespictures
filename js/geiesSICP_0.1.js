/*
	GEIESSICP - JS implementations from SICP
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.1 - Depends on Geieslists 1.1

	The MIT License - Copyright (c) 2016 GeiesSICP Project
*/
var S = function(L) {
  
  function make_tree(entry, left, right) { return ArrayToList([entry,left,right]); }

  var entry = first;
  var left_branch = second;
  var right_branch = third;

  function depth(tree) {
    if (isEmpty(tree)) return 0;
    return 1 + Math.max(depth(left_branch(tree)), depth(right_branch(tree)));
  }

  function build_set_naive(elements) {
    return build_set_helper(elements, nil);
    function build_set_helper(list, tree) {
      if (isEmpty(list)) return tree;
      if (element_of_set(head(list), tree)) return build_set_helper(tail(list), tree);
      return build_set_helper(tail(list), adjoin_set(head(list), tree));
    }
  }

  function tree_to_list1(tree) {
    if (isEmpty(tree)) return nil;
    return concat(tree_to_list1(left_branch(tree)),cons(entry(tree),tree_to_list1(right_branch(tree))));
  }

  function tree_to_list2(tree) {
    return reverse(tree_to_list_helper(tree, nil));
    
    function tree_to_list_helper(tree, list) {
      if (isEmpty(tree)) return list;
      return tree_to_list_helper(right_branch(tree), tree_to_list_helper(left_branch(tree),cons(entry(tree),list)));
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
    return head(partial_tree(sort(elements), size(elements)));

    function partial_tree(elts, n) {
      if (n === 0) return cons(nil, elts);
      var left_size = Math.floor((n - 1) / 2);
      var left_result = partial_tree(elts, left_size);
      var left_tree = head(left_result);
      var non_left_elts = tail(left_result);
      var right_size = n - (left_size+1);
      var this_entry = head(non_left_elts);
      var right_result = partial_tree(tail(non_left_elts), right_size);
      var right_tree = head(right_result);
      var remaining_elts = tail(right_result);
      return cons(make_tree(this_entry, left_tree,right_tree), remaining_elts);
    }
  }

  function decodeH (encoded,tree) {
    var symbols = first;
    var weight = second;
    var left_branch = third;
    var right_branch = fourth;

    var bits = ArrayToList(encoded.split('').filter(function(x) { return (x === '1' || x === '0');}));
    return decode(bits, tree);

    function decode(bits,tree) {
      if (size(bits) === 0) {
        if (size(head(tree)) === 1) {
          return head(head(tree));
        } else {
          throw new Error('non-existing encoding 1!');
        }
      }
      var currentBit = head(bits);
      if (currentBit === '0') return decode(tail(bits), left_branch(tree));
      if (currentBit === '1') return decode(tail(bits), right_branch(tree));
      throw new Error('non-existing encoding 2!')
    }
  }

  function buildH(symbols) {
    var enrichedSymbols = map(symbols, function(symbol) {
      return concat(symbol, ArrayToList([[],[]]));
    });
    return HtreeBuilder(enrichedSymbols);      
    
    function HtreeBuilder(nodes) {
      if (size(nodes) === 1) return head(nodes);
      var sortedNodes = sort(nodes, symbolsComparator);
      return HtreeBuilder(cons(make_parentH(first(sortedNodes), second(sortedNodes)), tail(tail(sortedNodes))));
    }
    function make_parentH(sa, sb) {
      var symbolsA = first(sa), symbolsB = first(sb), weightA = second(sa), weightB = second(sb);
      return ArrayToList([concat(symbolsA, symbolsB), weightA + weightB, sa, sb]);
    }
    function symbolsComparator(sa, sb) {
      var weightA = second(sa), weightB = second(sb);
      if (weightA === weightB) return 0;
      if (weightA > weightB) return 1;
      return -1;
    }
  }
  
  function dictionaryH(string) {
    return foldl(
      function(acc, x) {
        if (inDictionary(x, acc)) return increaseCount(x, acc);
        else return cons(ArrayToList([[x], 1]), acc);
      },
      nil,
      ArrayToList(string.split('').filter(function(x){return x !== ' ';})));

    // TODO - integrate with isMember by using a comparator
    function inDictionary(x, dict) {
      if (isEmpty(dict)) return false;
      if (x === head(head(head(dict)))) return true;
      return inDictionary(x, tail(dict));
    }
    function increaseCount(x, dict) {
      return map(dict, function(item) {
        if (x === head(first(item))) return ArrayToList([first(item), second(item) + 1]);
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
  }
}(L);
