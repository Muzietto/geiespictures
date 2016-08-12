/*
	GEIESSICP - JS mplementations from SICP
	Author: Marco Faustinelli (contacts@faustinelli.net)
	Web: http://faustinelli.net/
	     http://faustinelli.wordpress.com/
	Version: 0.2 - Requires Geieslists 1.1 and Geiesvectors 0.1

	The MIT License - Copyright (c) 2016 GeiesSICP Project
*/

var expect = chai.expect;
//		expect(head(head(listlA_BA))).to.be.equal('a');
//		expect(isEmpty(tail(head(listlA_BA)))).to.be.ok;
//		expect(isEmpty(tail(EMPTY))).to.be.not.ok;
//     expect(V.length_vect(pippo)).to.be.gt(3.16);

describe('Implementing SICP chapter 3 brings to the implementation of', function () {
  describe('a constraint evaluation system, inside which', function () {
    var _consoleLog = null;
    var probe = function() {
      var _msgs = [];
      var result = function(msg) {
        _msgs.push(msg);
      }
      result.test = function() { return _msgs.join(','); }
      return result
    }

    beforeEach(function() {
      _consoleLog = console.log;
      console.log = probe();
    });
    afterEach(function() {
      console.log = _consoleLog;
      _consoleLog = null;
    });

    describe('a value', function () {
      it('may be null or not null', function() {
        var test = S.value('test');
        expect(test.read()).to.be.null;
      });
      it('may have a name or not', function() {
        var test = S.value('test');
        expect(test.name()).to.be.equal('test');
        var noname = S.value();
        expect(noname.name()).to.be.undefined;
      });
      it('is mutable', function() {
        var test = S.value('test');
        expect(test.read()).to.be.null;
        test.set(124);
        expect(test.read()).to.be.equal(124);
        test.unset();
        expect(test.read()).to.be.null;
      });
      it('logs to the console its own value changes', function() {
        var test = S.value('test');
        expect(console.log.test()).to.be.equal('');
        test.set(123);
        expect(console.log.test()).to.be.equal('test - current value is 123');
        test.unset();
        expect(console.log.test()).to.be.equal('test - current value is 123,test - current value is null');
      });
      it('may link itself to an operator and broadcast its own value changes to it', function() {
        var op = { apply: function() { console.log('got a broadcast signal'); } };
        var test = S.value('test');
        test.link(op);
        test.set(123);
        expect(console.log.test()).to.be.equal('test - current value is 123,got a broadcast signal');
      });
    });
    describe('a constant', function () {
      it('requires an initialisation value', function() {
        expect(function() { return S.constant(); }).to.throw;
        expect(function() { return S.constant(123); }).to.not.throw;
      });
      it('has no name', function() {
        var PI = S.constant(Math.PI);
        expect(PI.name()).to.be.undefined;
      });
      it('is not mutable', function() {
        var PI = S.constant(Math.PI);
        expect(PI.read()).to.be.equal(Math.PI);
        PI.set('whatever');
        expect(PI.read()).to.be.equal(Math.PI);
      });  
    });

    describe('a sum', function () {
      it('requires two operands and one resuls', function() {
        expect(function() { return S.sum(); }).to.throw;
        expect(function() { return S.sum('1'); }).to.throw;
        expect(function() { return S.sum('1','2'); }).to.throw;
        expect(function() { return S.sum('1','2','3'); }).to.not.throw;
      });
      it('tries to resolve constraints at construction by computing sum', function() {
        var result = S.value('result');
        var tredici = S.sum(S.constant(1), S.constant(12), result);
        expect(console.log.test()).to.be.equal('result - current value is 13');
      });
      it('tries to resolve constraints at construction by computing vb', function() {
        var vb = S.value('vb');
        var undici = S.sum(S.constant(1), vb, S.constant(12));
        expect(console.log.test()).to.be.equal('vb - current value is 11');
      });
      it('tries to resolve constraints at construction by computing vb', function() {
        var vb = S.value('vb');
        var minUndici = S.sum(S.constant(12), vb, S.constant(1));
        expect(console.log.test()).to.be.equal('vb - current value is -11');
      });
      it('tries to resolve constraints at construction by computing va', function() {
        var va = S.value('va');
        var undici = S.sum(va, S.constant(1), S.constant(12));
        expect(console.log.test()).to.be.equal('va - current value is 11');
      });
      it('tries to resolve constraints at construction by computing va', function() {
        var va = S.value('va');
        var minUndici = S.sum(va, S.constant(12), S.constant(1));
        expect(console.log.test()).to.be.equal('va - current value is -11');
      });
      it('reacts to broadcast messages from its own values', function() {
        var va = S.value('va');
        var summ = S.value('summ');
        var plus1 = S.sum(va, S.constant(1), summ);

        va.set(1);
        expect(summ.read()).to.be.equal(2);
        expect(console.log.test()).to.contain('va - current value is 1,summ - current value is 2');

        va.unset();
        expect(summ.read()).to.be.null;
        expect(console.log.test()).to.contain('va - current value is null,summ - current value is null');

        summ.set(10);
        expect(va.read()).to.be.equal(9);
        expect(console.log.test()).to.contain('summ - current value is 10,va - current value is 9');

        summ.unset();
        expect(va.read()).to.be.null;
        expect(console.log.test()).to.be.equal('va - current value is 1,summ - current value is 2,va - current value is null,summ - current value is null,summ - current value is 10,va - current value is 9,summ - current value is null,va - current value is null');
      });
    });

    describe('a product', function () {
      it('tries to resolve constraints at construction by computing product', function() {
        var result = S.value('result');
        var ventiquattro = S.product(S.constant(2), S.constant(12), result);
        expect(console.log.test()).to.be.equal('result - current value is 24');
      });
      it('tries to resolve constraints at construction by computing vb', function() {
        var vb = S.value('vb');
        var due = S.product(S.constant(2), vb, S.constant(4));
        expect(console.log.test()).to.be.equal('vb - current value is 2');
      });
      it('tries to resolve constraints at construction by computing vb', function() {
        var vb = S.value('vb');
        var unMezzo = S.product(S.constant(4), vb, S.constant(2));
        expect(console.log.test()).to.be.equal('vb - current value is 0.5');
      });
      it('tries to resolve constraints at construction by computing va', function() {
        var va = S.value('va');
        var due = S.product(va, S.constant(2), S.constant(4));
        expect(console.log.test()).to.be.equal('va - current value is 2');
      });
      it('tries to resolve constraints at construction by computing va', function() {
        var va = S.value('va');
        var unMezzo = S.product(va, S.constant(4), S.constant(2));
        expect(console.log.test()).to.be.equal('va - current value is 0.5');
      });
    });

    describe('a power', function () {
      it('tries to resolve constraints at construction by computing power', function() {
        var result = S.value('result');
        var otto = S.power(S.constant(2), S.constant(3), result);
        expect(console.log.test()).to.be.equal('result - current value is 8');
      });
      it('tries to resolve constraints at construction by computing vb (logarithm)', function() {
        var vb = S.value('vb');
        var three = S.power(S.constant(2), vb, S.constant(8));
        expect(console.log.test()).to.be.equal('vb - current value is 3');
      });
      it('tries to resolve constraints at construction by computing vb (logarithm)', function() {
        var vb = S.value('vb');
        var unMezzo = S.power(S.constant(4), vb, S.constant(2));
        expect(console.log.test()).to.be.equal('vb - current value is 0.5');
      });
      it('tries to resolve constraints at construction by computing va (base)', function() {
        var va = S.value('va');
        var due = S.power(va, S.constant(3), S.constant(8));
        expect(console.log.test()).to.be.equal('va - current value is 2');
      });
      it('tries to resolve constraints at construction by computing va (base)', function() {
        var va = S.value('va');
        var unMezzo = S.power(va, S.constant(3), S.constant(1/8));
        expect(console.log.test()).to.be.equal('va - current value is 0.5');
      });
    });

    // P = 2 * (C -32)
    describe('a more complex expression', function() {
      var C = S.value('C');
      var P = S.value('P');
      var vallo = S.value('vallo');
      var cMin32 = S.sum(C, S.constant(-32), vallo);
      var pHalf = S.product(P, S.constant(0.5), vallo);

      it('can be set and unset from any of its own free values', function() {
        C.set(34);
        expect(vallo.read()).to.be.equal(2);
        expect(P.read()).to.be.equal(4);

        P.unset();
        expect(vallo.read()).to.be.null;
        expect(C.read()).to.be.null;

        P.set(4);
        expect(vallo.read()).to.be.equal(2);
        expect(C.read()).to.be.equal(34);
      });
    });

    // P = (2 * (C -32))^(E + 1)
    describe('a multivariable system', function() {
      var C = S.value('C');
      var P = S.value('P');
      var E = S.value('E');
      var cMin32Val = S.value('cMin32Val');
      var ePlus1Val = S.value('ePlus1Val');
      var cMin32Times2Val = S.value('cMin32Times2Val');
      var cMin32 = S.sum(C, S.constant(-32), cMin32Val);
      var ePlus1 = S.sum(E, S.constant(1), ePlus1Val);
      var cMin32Times2 = S.product(cMin32Val, S.constant(2), cMin32Times2Val);
      var thePower = S.power(cMin32Times2Val, ePlus1Val, P);

      it('can be set and unset from any of its own free values', function() {
        C.set(34);
        expect(cMin32Val.read()).to.be.equal(2);
        expect(cMin32Times2Val.read()).to.be.equal(4);
        expect(P.read()).to.be.null;

        E.set(1);
        expect(ePlus1Val.read()).to.be.equal(2);
        expect(P.read()).to.be.equal(16);

        P.unset();
        expect(cMin32Val.read()).to.be.null;
        expect(cMin32Times2Val.read()).to.be.null;
        expect(C.read()).to.be.null;
        expect(ePlus1Val.read()).to.be.null;
        expect(E.read()).to.be.null;

        P.set(16);
        expect(cMin32Times2Val.read()).to.be.null;
        expect(ePlus1Val.read()).to.be.null;

        C.set(34);
        expect(cMin32Val.read()).to.be.equal(2);
        expect(cMin32Times2Val.read()).to.be.equal(4);
        expect(ePlus1Val.read()).to.be.equal(2);
        expect(E.read()).to.be.equal(1);
      });
    });
  });
});