(function (doc, win) {
  var window = win,
    width = 750,
    docEl = doc.documentElement,
    resizeCall = (function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) {
        docEl.style.fontSize = 100 + 'px';
      } else {
        if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
          docEl.style.fontSize = 100 * (clientWidth / parseInt(width)) + 'px';
        } else {
          var percentage = clientWidth / 1920;
          var fsize = 100 * percentage;
          fsize = fsize < 25 ? 25 + 'px' : fsize > 100 ? 100 + 'px' : fsize + 'px';
          docEl.style.fontSize = fsize;
        }
      }
      return resizeCall;
    })();
  var dpr = window.devicePixelRatio || 1;
  dpr = dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1;
  docEl.setAttribute('data-dpr', dpr);
  window.addEventListener && window.addEventListener('resize', resizeCall, false);
})(document, window);
