/**
 * エラー確認モック用。再入力したら項目エラー見た目を通常に戻す。
 * :focus 中の体裁は CSS。テキストはフォーカスで既存値を消し、打ち直しやすくする。
 * 入力・変更後は Modifier / aria を外してフォーカスアウト後も戻さない。
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

  function hideErrorList(listId) {
    if (!listId) {
      return;
    }
    var list = document.getElementById(listId);
    if (list) {
      list.hidden = true;
    }
  }

  function clearControlError(control) {
    control.classList.remove("input--error");
    control.classList.remove("select__control--error");

    var describedby = control.getAttribute("aria-describedby");
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-describedby");
    hideErrorList(describedby);

    // 生年月日のように同じエラーリストを共有する兄弟もまとめて戻す
    if (!describedby) {
      return;
    }
    var root =
      closest(control, ".field") || closest(control, ".select-area");
    if (!root) {
      return;
    }
    var siblings = root.querySelectorAll(
      'input[aria-describedby="' +
        describedby +
        '"], select[aria-describedby="' +
        describedby +
        '"]',
    );
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].classList.remove("input--error");
      siblings[i].classList.remove("select__control--error");
      siblings[i].removeAttribute("aria-invalid");
      siblings[i].removeAttribute("aria-describedby");
    }
  }

  document.addEventListener("focusin", function (event) {
    var target = event.target;
    if (target && target.classList && target.classList.contains("input--error")) {
      target.value = "";
    }
  });

  document.addEventListener("input", function (event) {
    var target = event.target;
    if (target && target.classList && target.classList.contains("input--error")) {
      clearControlError(target);
    }
  });

  document.addEventListener("change", function (event) {
    var target = event.target;
    if (
      target &&
      target.classList &&
      target.classList.contains("select__control--error")
    ) {
      clearControlError(target);
    }
  });
})();
