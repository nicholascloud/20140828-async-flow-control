(function () {

  function toLowerWord(word) {
    return word.toLowerCase().replace(/[^a-z]/gmi, '');
  }

  var walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  var node;
  var textNodes = window._textNodes = [];
  var wc = window._wc = {};
  var maxCount = 0;

  while(node = walker.nextNode()) {
    var value = node.nodeValue.trim();
    if (!value) {
      continue;
    }
    textNodes.push(node);
    value.split(' ').map(toLowerWord).filter(function (word) {
      return !!word.length;
    }).forEach(function (word) {
      var count = wc[word] || 0;
      count += 1;
      wc[word] = count;
      maxCount = Math.max(maxCount, count);
    });

  }

  function padLeft(number, places) {
    var numStr = number.toString(),
      len = numStr.length,
      howMany = Math.min(0, places || 3 - len);
    while (howMany > 0) {
      numStr = '0' + numStr;
      howMany -= 1;
    }
    return numStr;
  }

  while(node = textNodes.pop()) {
    var parent = node.parentNode,
      textSpan = document.createElement('span');

    node.nodeValue.split(' ').forEach(function (word) {
      var lowerCaseWord = toLowerWord(word);
      var wordSpan = document.createElement('span');
      wordSpan.style.fontSize = '1em';
      if (wc.hasOwnProperty(lowerCaseWord)) {
        var count = wc[lowerCaseWord];
        var fontSize = '1.' + padLeft(count, maxCount.toString().length) + 'em';
        wordSpan.style.fontSize = fontSize;
      }
      wordSpan.appendChild(document.createTextNode(word + ' '));
      textSpan.appendChild(wordSpan);
    });

    parent.replaceChild(textSpan, node);
  }

}());