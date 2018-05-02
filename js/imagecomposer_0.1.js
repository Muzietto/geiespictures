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

    return {
      process: processData(qsPieces, components),
      components: components,
    };

    function splitQuerystring(string) {
      return string.split('&'); // TODO filter away null items
    }

    function processData(arra, components) {

      let result = arra.reduce((acc, curr) => {

        if (curr === '') return acc;

        switch (curr.split('=')[0]) {

          case 'order': {
            var canvasBackground = (components.bkgImg)
              ? Object.keys(components.bkgImg)[0]
              : 'nullBackground';
            var canvasComponents = decodeURIComponent(curr.split('=')[1]).split(',');
            acc.order = [canvasBackground].concat(canvasComponents);
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
        var qsValue = curr.split('=')[1];
        var canvasComponentName = qsKey.split('_')[0];
        if (canvasComponentName === 'order') return acc;

        var canvasComponentType = /[a-zA-Z]+/.exec(canvasComponentName)[0];
        var paramName = qsKey.split('_')[1];

        if (!acc[canvasComponentType]) acc[canvasComponentType] = {};
        if (!acc[canvasComponentType][canvasComponentName])
          acc[canvasComponentType][canvasComponentName] = {};

        acc[canvasComponentType][canvasComponentName][paramName] = qsValue;

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

    var fontFamily = qsTextboxObj.fontFamily || 'Arial';
    var fontSize = (qsTextboxObj.font || '20') + 'px';

    return {
      object: {
        text: qsTextboxObj.text || 'undefined',
        font: fontSize + ' ' + fontFamily,
        color: qsTextboxObj.fontColor || 'black',
      },
      frame: P.make_frame(origin, edgeX, edgeY),
    };
  }

  function painterReadyImage(qsImageObj) {
    var rotationDeg = (qsImageObj.finalRotateAngle)
      ? parseFloat(qsImageObj.finalRotateAngle)
      : 0;
    var rotationRads = V.rotation_matrix(Math.PI * rotationDeg / 180);

    var origin = V.make_vect(parseInt(qsImageObj.x, 10), parseInt(qsImageObj.y, 10));
    var edgeX = V.rotate_vect(V.make_vect(parseInt(qsImageObj.w, 10), 0), rotationRads);
    var edgeY = V.rotate_vect(V.make_vect(0, parseInt(qsImageObj.h, 10)), rotationRads);

    return {
      object: {
        url: qsImageObj.url,
      },
      frame: P.make_frame(origin, edgeX, edgeY),
    };
  }

  function paintDecomposedQs(qs, ctx) {
    var PAINT_CONTROL_FRAME = true;
    var decodQs = decomposedQs(qs);

    decodQs.process.order.forEach(canvasComponentName => {

      canvasComponentName = canvasComponentName.trim();

      var canvasComponentType = /[a-zA-Z]+/.exec(canvasComponentName)[0];

      switch (canvasComponentType) {
        case 'textbox': {
          var painterReadyObj = painterReadyText(decodQs.components.textbox[canvasComponentName]);

          P.text_painter(painterReadyObj.object)(painterReadyObj.frame, PAINT_CONTROL_FRAME)(ctx);

          break;
        }
        case 'custImg': {
          var painterReadyObj = painterReadyImage(decodQs.components.custImg[canvasComponentName]);

          var img = document.getElementById(painterReadyObj.object.url);
          // TODO - put here promise-based logic for url retrieval instead of previous line
          P.picture_painter(img)(painterReadyObj.frame, PAINT_CONTROL_FRAME)(ctx);

          break;
        }
      }
    });
  }

  return {
    decomposedQs: decomposedQs,
    painterReadyText: painterReadyText,
    painterReadyImage: painterReadyImage,
    paintFromDecomposedQs: paintDecomposedQs,
  };
}(L, V, P);
