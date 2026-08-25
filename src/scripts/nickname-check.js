/**
 * ニックネームの使用可否チェック（モック）。
 *
 * 本番の namecheck Ajax は使わない。
 * 虫眼鏡をクリックすると、同じ .nickname-check 内の結果ボックスを表示する。
 * 「似たようなニックネーム」をクリックすると、その文字列を入力欄へ入れる。
 */
(function () {
  function closest(element, selector) {
    while (element && element.nodeType === 1) {
      if (element.matches(selector)) {
        return element;
      }
      element = element.parentElement;
    }
    return null;
  }

  document.addEventListener("click", function (event) {
    var searchButton = closest(event.target, ".input-search__button");
    if (searchButton) {
      var searchRoot = closest(searchButton, ".nickname-check");
      var input = searchRoot && searchRoot.querySelector("input.input");
      var result = searchRoot && searchRoot.querySelector(".nickname-check__result");

      if (!input || !result) {
        return;
      }

      if (!input.value.trim()) {
        input.focus();
        return;
      }

      result.hidden = false;
      searchButton.setAttribute("aria-expanded", "true");
      return;
    }

    var suggestion = closest(event.target, ".nickname-check__suggestion");
    if (suggestion) {
      var suggestionRoot = closest(suggestion, ".nickname-check");
      var suggestionInput =
        suggestionRoot && suggestionRoot.querySelector("input.input");

      if (suggestionInput) {
        suggestionInput.value = suggestion.textContent.replace(/^\s+|\s+$/g, "");
        suggestionInput.focus();
      }
    }
  });
})();
