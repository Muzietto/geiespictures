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

    it('like traslated texts', () => {

      var textbox = {
        x: '123',
        y: '345',
        w: '300',
        h: '100',
        text: 'lorem ipsum',
        align: 'L',
        valign: 'C',
        valignMethod: 'v',
        font: '17',
        fontColor: 'red',
        maxFontSize: '96',
        effect: 'null',
      };

      var resultText = {
        text: 'lorem ipsum',
        font: '17px Arial',
      };

      var resultFrame = P.make_frame(
        V.make_vect(123, 345),
        V.make_vect(300, 0),
        V.make_vect(0, 100)
      );

      var actual = IC.painterReadyText(textbox);

      expect(actual.object).to.be.eql(resultText);
      expect(actual.frame.c).to.be.eql(resultFrame.c);
    });

    it('like rotated texts', () => {
      var textbox = {
        x: '123',
        y: '345',
        w: '300',
        h: '100',
        text: 'lorem ipsum',
        rotateAngleForWholeTextbox: '24',
        align: 'L',
        valign: 'C',
        valignMethod: 'v',
        font: '17',
        fontColor: 'red',
        maxFontSize: '96',
        effect: 'null',
      };

    });

    it('like translated images', () => {

    });

    it('like rotated images', () => {

    });
  });

});
