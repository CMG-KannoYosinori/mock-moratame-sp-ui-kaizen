/**
 * エラー確認モック用。再入力したら項目エラー見た目を通常に戻す。
 * :focus 中の体裁は CSS。テキストはフォーカスで既存値を消し、打ち直しやすくする。
 * 入力・変更後は Modifier を外してフォーカスアウト後も戻さない。
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

  function clearControlError(control) {
    control.classList.remove("input--error");
    control.classList.remove("select__control--error");

    var root =
      closest(control, ".field") || closest(control, ".select-area");
    if (!root) {
      return;
    }

    var messages = root.querySelectorAll(".field__error");
    for (var i = 0; i < messages.length; i++) {
      messages[i].hidden = true;
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
