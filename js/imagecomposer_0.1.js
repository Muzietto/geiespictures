/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 1.0 - Requires Geieslists 1.1 and Geiesvectors 0.1

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
      return arra.reduce((acc, curr) => {
        switch (curr.substr(0, 5)) {
          case 'order': {
            var canvasBackground = Object.keys(components.bkgImg)[0] || 'nullBackground';
            var canvasComponents = decodeURIComponent(curr.split('=')[1]).split(',');
            acc.order = [canvasBackground].concat(canvasComponents);
          }
          default: {
          }
        }
        return acc;
      }, {});
    }

    function componentsData(arra) {

      return arra.reduce((acc, curr) => {

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
    }

  }

  function painterReadyText(qsTextboxObj) {
    var origin = V.make_vect(qsTextboxObj.x, qsTextboxObj.y);
    var edgeX = V.make_vect(parseInt(qsTextboxObj.w, 10), 0);
    var edgeY = V.make_vect(0, parseInt(qsTextboxObj.h, 10));

    var fontFamily = qsTextboxObj.fontFamily || 'Arial';
    var fontSize = (qsTextboxObj.font || '20') + 'px';

    return {
      object: {
        text: qsTextboxObj.text || 'undefined',
        font: fontSize + ' ' + fontFamily
      },
      frame: P.make_frame(origin, edgeX, edgeY),
    };
  }

  return {
    decomposedQs: decomposedQs,
    painterReadyText: painterReadyText,
  };
}(L, V, P);
