/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 0.1 - Requires Geieslists 1.1, Geiesvectors 0.2 and Geiespictures 1.0

 The MIT License - Copyright (c) 2016-2018 Geiespictures Project
 */
var IC = function (L, V, P) {

  function decomposedQs(qs) {

    var qsPieces = splitQuerystring(qs);
    var components = componentsData(qsPieces);
    let process = processData(qsPieces, components);

    return {
      process: process,
      components: components,
    };

    function splitQuerystring(string) {
      return string.split('&'); // TODO filter away null items
    }

    function processData(arra, components) {

      let result = arra.reduce((acc, curr) => {

        if (curr === '') return acc;

        switch (curr.split('=')[0]) {

          case 'objectOrder': {
            var canvasBackground = (components.bkgImg)
              ? Object.keys(components.bkgImg)[0]
              : 'nullBackground';
            var canvasComponents = decodeURIComponent(curr.split('=')[1]).split(',');
            acc.objectOrder = [canvasBackground].concat(canvasComponents);
            break;
          }
          case 'resol': {
            acc.resol = curr.split('=')[1];
            break;
          }
          default: {
          }
        }
        return acc;
      }, {});

      return result;
    }

    function componentsData(arra) {

      let result = arra.reduce((acc, curr) => {

        if (!curr) return acc;

        var qsKey = curr.split('=')[0];
        if (['objectOrder', 'resol'].includes(qsKey)) return acc;

        var qsValue = curr.split('=')[1];

        var splitKey = /(^[^_]+)_(.+$)/.exec(qsKey);
        var canvasComponentName = splitKey[1];
        var paramName = splitKey[2];


        var canvasComponentType = /[a-zA-Z]+/.exec(canvasComponentName)[0];

        if (!acc[canvasComponentType]) acc[canvasComponentType] = {};
        if (!acc[canvasComponentType][canvasComponentName])
          acc[canvasComponentType][canvasComponentName] = {};

        switch (paramName) {

          case 'effect': {
            acc[canvasComponentType][canvasComponentName][paramName] = decodeURIComponent(qsValue).split(',');
            break;
          }
          default: {
            acc[canvasComponentType][canvasComponentName][paramName] = decodeURIComponent(qsValue);
          }
        }

        return acc;
      }, {});

      return result;
    }

  }

  function painterReadyText(qsTextboxObj) {

    var rotationDeg = (qsTextboxObj.rotateAngleForWholeTextbox)
      ? parseFloat(qsTextboxObj.rotateAngleForWholeTextbox)
      : 0;
    var rotationRads = V.rotation_matrix(Math.PI * rotationDeg / 180);

    var origin = V.make_vect(parseInt(qsTextboxObj.x, 10), parseInt(qsTextboxObj.y, 10));
    var edgeX = V.rotate_vect(V.make_vect(parseInt(qsTextboxObj.w, 10), 0), rotationRads);
    var edgeY = V.rotate_vect(V.make_vect(0, parseInt(qsTextboxObj.h, 10)), rotationRads);


    return {
      object: {
        text: decodeURIComponent(qsTextboxObj.text) || 'undefined',
        fontFamily: qsTextboxObj.fontFamily || 'Arial',
        fontSize: parseInt((qsTextboxObj.font || '20'), 10),
        maxFontSize: parseInt((qsTextboxObj.maxFontSize || '300'), 10),
        color: qsTextboxObj.fontColor || 'black',
        width: qsTextboxObj.w,
        height: qsTextboxObj.h,
        align: alignMapper(qsTextboxObj.align || 'left'),
        baseline: valignMapper(qsTextboxObj.valign || 'B'),
      },
      frame: P.make_frame(origin, edgeX, edgeY),
    };

    function alignMapper(str) {
      return {
        L: 'left',
        C: 'center',
        R: 'right',
      }[str];
    }

    function valignMapper(str) {
      return {
        B: 'hanging',
        M: 'middle',
        A: 'alphabetic',
      }[str];
    }
  }

  function painterReadyImage(qsImageObj) {

    var rotationDeg = (qsImageObj.finalRotateAngle)
      ? parseFloat(qsImageObj.finalRotateAngle)
      : 0;
    var rotationRads = V.rotation_matrix(Math.PI * rotationDeg / 180);

    var origin = V.make_vect(parseInt(qsImageObj.x, 10), parseInt(qsImageObj.y, 10));
    var edgeX = V.rotate_vect(V.make_vect(parseInt(qsImageObj.w, 10), 0), rotationRads);
    var edgeY = V.rotate_vect(V.make_vect(0, parseInt(qsImageObj.h, 10)), rotationRads);

    let result = {
      object: {
        url: qsImageObj.url,
      },
      frame: P.make_frame(origin, edgeX, edgeY),
    };

    (Object.keys(qsImageObj)).forEach(key => {

      switch (key) {
        case 'effectFlip_param': {
          result.frame = P.flip_frame_vert(result.frame);
        }
        case 'effectFlop_param': {
          result.frame = P.flip_frame_horiz(result.frame);
        }
        default:
      }
    });

    return result;
  }

  function painterReadyBackground(qsBackgroundObj) {

    //var origin = V.make_vect(0, 0);
    //var edgeX = V.make_vect(ctx.canvas.clientWidth, 0);
    //var edgeY = V.make_vect(0, ctx.canvas.clientHeight);

    return {
      object: {
        url: qsBackgroundObj.url,
      },
      //frame: P.make_frame(origin, edgeX, edgeY),
    };
  }

  function dimensionedCanvas(qs) {
    var resolValues = (decomposedQs(qs).process.resol || '630x310')
      .split('x')
      .map(str => parseInt(str, 10));

    var resultCanvas = document.createElement('canvas');
    resultCanvas.width = resolValues[0];
    resultCanvas.height = resolValues[1];

    return resultCanvas;
  }

  function paintDecomposedQs(qs, ctx) {
    var PAINT_CONTROL_FRAME = false;
    var decodQs = decomposedQs(qs);

    // ugly hack involving setTimeout - rewrite using promises!!
    decodQs.process.objectOrder.forEach(canvasComponentName => {

      canvasComponentName = canvasComponentName.trim();

      var canvasComponentType = /[a-zA-Z]+/.exec(canvasComponentName)[0];

      switch (canvasComponentType) {

        case 'nullBackground': {
          break;
        }
        case 'textbox': {
          var painterReadyObj = painterReadyText(decodQs.components.textbox[canvasComponentName]);

          setTimeout(() => {

            P.text_painter(painterReadyObj.object)(painterReadyObj.frame, PAINT_CONTROL_FRAME)(ctx);
          }, 200);

          break;
        }
        case 'custImg': {
          var painterReadyObj = painterReadyImage(decodQs.components.custImg[canvasComponentName]);

          var img = document.getElementById(painterReadyObj.object.url) || {width: 100, height: 120};
          // TODO - put here promise-based logic for url retrieval instead of previous line
          // TODO - put also injection point for test mocks
          P.picture_painter(img)(painterReadyObj.frame, PAINT_CONTROL_FRAME)(ctx);

          break;
        }
        case 'bkgImg': {
          var painterReadyObj = painterReadyBackground(decodQs.components.bkgImg[canvasComponentName]);

          var img = document.getElementById(painterReadyObj.object.url);
          // TODO - put here promise-based logic for url retrieval instead of previous line
          P.background_painter(img)()(ctx);

          break;
        }
      }
    });
  }

  return {
    decomposedQs: decomposedQs,
    painterReadyText: painterReadyText,
    painterReadyImage: painterReadyImage,
    painterReadyBackground: painterReadyBackground,
    paintFromDecomposedQs: paintDecomposedQs,
    dimensionedCanvas: dimensionedCanvas,
  };
}(L, V, P);
