/*
 GEIESPICTURES - The picture language from chapter 2 of SICP
 Author: Marco Faustinelli (contacts@faustinelli.net)
 Web: http://faustinelli.net/
 http://faustinelli.wordpress.com/
 Version: 1.0 - Requires Geieslists 1.1 and Geiesvectors 0.1

 The MIT License - Copyright (c) 2016-2018 Geiespictures Project
 */
var IC = function (L, V, P) {

  var decomposedQs = qs => {

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

  };

  return {
    decomposedQs: decomposedQs,
  };
}(L, V, P);
