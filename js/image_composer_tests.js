/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 0.1 - Requires Geieslists 1.1, Geiesvectors 0.2 and Geiespictures 1.0

 The MIT License - Copyright (c) 2016-2018 Geiespictures Project
 */

var expect = chai.expect;

describe('an image painter for composite canvases', () => {

  it('groups data belonging to different graphic components', () => {

    var input = '&textbox1_x=123&textbox2_x=234' +
      '&custImg0_url=some_url&bkgImg12_url=some_other_url' +
      '&order=custImg0%2Ctextbox1%2Ctextbox2' +
      '&textbox1_y=345&textbox2_valign=C';

    var output = {
      process: {
        order: [
          'bkgImg12',
          'custImg0',
          'textbox1',
          'textbox2',
        ],
      },
      components: {
        custImg: {
          custImg0: {
            url: 'some_url',
          },
        },
        bkgImg: {
          bkgImg12: {
            url: 'some_other_url',
          },
        },
        textbox: {
          textbox1: {
            x: '123',
            y: '345',
          },
          textbox2: {
            x: '234',
            valign: 'C',
          },
        },
      },
    };

    let result = IC.decomposedQs(input);
    expect(result).to.be.eql(output);
  });

  describe('can convert decomposed querystrings into objects useable by geiespictures', () => {

    it('like traslated+rotated texts', () => {

      var qsTextbox = {
        x: '123',
        y: '345',
        w: '300',
        h: '100',
        text: 'lorem ipsum',
        align: 'L',
        valign: 'M',
        valignMethod: 'v',
        font: '17',
        rotateAngleForWholeTextbox: '30',
        fontColor: 'red',
        maxFontSize: '96',
        effect: 'null',
      };

      var resultText = {
        text: 'lorem ipsum',
        fontSize: 17,
        fontFamily: 'Arial',
        width: '300',
        height: '100',
        maxFontSize: 96,
        color: 'red',
        align: 'left',
        baseline: 'middle',
      };

      let rotation = V.rotation_matrix(Math.PI / 6);

      var resultFrame = P.make_frame(
        V.make_vect(123, 345),
        V.rotate_vect(V.make_vect(300, 0), rotation),
        V.rotate_vect(V.make_vect(0, 100), rotation),
      );

      var actual = IC.painterReadyText(qsTextbox);

      expect(actual.object).to.be.eql(resultText);
      expect(actual.frame.c).to.be.eql(resultFrame.c);
    });

    it('like traslated+rotated images', () => {

      var qsImage = {
        x: '123',
        y: '345',
        w: '300',
        h: '100',
        url: 'scream',
        finalRotateAngle: '30',
        cacheVer: '2',
        effect: 'null',
      };

      var resultImage = {
        url: 'scream',
      };

      let rotation = V.rotation_matrix(Math.PI / 6);

      var resultFrame = P.make_frame(
        V.make_vect(123, 345),
        V.rotate_vect(V.make_vect(300, 0), rotation),
        V.rotate_vect(V.make_vect(0, 100), rotation),
      );

      var actual = IC.painterReadyImage(qsImage);

      expect(actual.object).to.be.eql(resultImage);
      expect(actual.frame.c).to.be.eql(resultFrame.c);
    });
  });

  describe.only('the reader monad can assist IC.painterReadyText', function () {
    var reader = MONAD.reader,
      unit = MONAD.reader.UNIT,
      ask = MONAD.reader.ask,
      asks = MONAD.reader.asks,
      local = MONAD.reader.local
    ;

    var greet = name => ask().bind(ctx => {
      //debugger;
      return unit(ctx + ', ' + name);
    });

    var firstStepMonad = ask().bind(qsTextboxObj => {

      var rotationDeg = (qsTextboxObj.rotateAngleForWholeTextbox)
        ? parseFloat(qsTextboxObj.rotateAngleForWholeTextbox)
        : 0;
      var rotationRads = V.rotation_matrix(Math.PI * rotationDeg / 180);

      var origin = V.make_vect(parseInt(qsTextboxObj.x, 10), parseInt(qsTextboxObj.y, 10));
      var edgeX = V.rotate_vect(V.make_vect(parseInt(qsTextboxObj.w, 10), 0), rotationRads);
      var edgeY = V.rotate_vect(V.make_vect(0, parseInt(qsTextboxObj.h, 10)), rotationRads);

      return unit({
        frame: P.make_frame(origin, edgeX, edgeY),
      });
    });

    var secondStepMonadicFunction = partialResult => {

      return ask().bind(qsTextboxObj => {
        partialResult.object = {
          text: decodeURIComponent(qsTextboxObj.text) || 'undefined',
        };

        return unit(partialResult);
      });
    };

    it('by using the decomposed querystring as context', function () {
      debugger;
      var qs = input();
      var qsTextboxObj = IC.decomposedQs(qs).components.textbox.textbox0;

      var firstStepResult = firstStepMonad(qsTextboxObj);

      var secondStepMonad = firstStepMonad.bind(secondStepMonadicFunction);

      var secondStepResult = secondStepMonad(qsTextboxObj);


      var pippo = 12;

      function input() {
        return '&textbox0_x=1000&textbox0_effect=null&textbox0_h=100' +
          '&textbox0_w=900&textbox0_font=17&textbox0_fontColor=red' +
          '&textbox0_text=lorem%20ipsum&textbox0_align=R&textbox0_y=650' +
          '&textbox0_valign=A&textbox0_maxFontSize=400';
      }
    });
  });

  xdescribe('can invoke geiespictures painters after reading a querystring', () => {

    it('containing one text', () => {

      var qsText = '&textbox1_x=123&textbox1_effect=null&textbox1_h=100&textbox1_w=300&textbox1_font=17' +
        '&order=textbox1&textbox1_fontcolor=red&textbox1_text=lorem+ipsum&textbox1_align=L' +
        '&textbox1_y=345&textbox1_valign=C&textbox1_maxFontSize=96&textbox1_valignMethod=v' +
        '&textbox1_rotateAngleForWholeTextbox=30';

      var testProbe = probe();

      IC.paintFromDecomposedQs(qsText, fakeCtx()(testProbe));

      var rotationMatrix = V.rotation_matrix(Math.PI * 30 / 180);
      var rotationAngle = V.angle_vect(V.rotate_vect(V.make_vect(100, 0), rotationMatrix));

      expect(testProbe.textPosX).to.be.eql(123);
      expect(testProbe.textPosY).to.be.eql(345);
      expect(testProbe.text).to.be.eql('lorem+ipsum');
      expect(testProbe.rotation).to.be.eql(rotationAngle);

    });
  });

});

function probe() {
  return {
    origin: {x: 0, y: 0},
    rotation: 0,
  };
}

function fakeCtx() {
  return probe => {
    return {
      font: '',
      canvas: {
        clientWidth: 400,
        clientHeight: 200
      },
      resetTransform: () => {
      },
      translate: (x, y) => {
        probe.origin.x = x;
        probe.origin.y = y;
      },
      rotate: (rotation) => {
        probe.rotation = rotation;
      },
      beginPath: () => {
      },
      moveTo: (x, y) => {
        probe.startX = x;
        probe.startY = y;
      },
      lineTo: (x, y) => {
        probe.endX = x;
        probe.endY = y;
      },
      arc: (cx, cy, r, start, end) => {
        probe.centerX = cx;
        probe.centerY = cy;
        probe.radius = r;
      },
      fillText: (text, x, y) => {
        probe.textPosX = probe.origin.x + x;
        probe.textPosY = probe.origin.y + y;
        probe.text = text;
      },
      stroke: () => {
      },
      transform: (m11, m21, m12, m22, m13, m23) => {
        probe._11 = m11;
        probe._21 = m21;
        probe._12 = m12;
        probe._22 = m22;
        probe._13 = m13;
        probe._23 = m23;
      }
    };
  };
}
