/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 0.1 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016 Geiespictures Project
 */

var expect = chai.expect;
//		expect(head(head(listlA_BA))).to.be.equal('a');
//		expect(isEmpty(tail(head(listlA_BA)))).to.be.ok;
//		expect(isEmpty(tail(EMPTY))).to.be.not.ok;

describe('an image painter for composite canvases', () => {

  it('groups data belonging to different graphic components', () => {

    var input = '&textbox1_x=123&textbox2_x=234' +
      '&image0_url=some_url&bkgImg12_url=some_other_url' +
      '&order=image0%2Ctextbox1%2Ctextbox2' +
      '&textbox1_y=345&textbox2_valign=C';

    var output = {
      process: {
        order: [
          'bkgImg12',
          'image0',
          'textbox1',
          'textbox2',
        ],
      },
      components: {
        image: {
          image0: {
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
        valign: 'C',
        valignMethod: 'v',
        font: '17',
        rotateAngleForWholeTextbox: '30',
        fontColor: 'red',
        maxFontSize: '96',
        effect: 'null',
      };

      var resultText = {
        text: 'lorem ipsum',
        font: '17px Arial',
        color: 'red',
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

});
