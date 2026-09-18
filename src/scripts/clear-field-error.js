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

  function hideFieldErrorLists(describedby) {
    if (!describedby) {
      return;
    }
    var ids = describedby.replace(/^\s+|\s+$/g, "").split(/\s+/);
    for (var i = 0; i < ids.length; i++) {
      var list = document.getElementById(ids[i]);
      // ページ全体の .form-error は残し、項目エラーだけ隠す
      if (list && list.classList.contains("field__error")) {
        list.hidden = true;
      }
    }
  }

  function clearControlError(control) {
    control.classList.remove("input--error");
    control.classList.remove("select__control--error");

    var describedby = control.getAttribute("aria-describedby");
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-describedby");
    hideFieldErrorLists(describedby);

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
      "input.input--error, select.select__control--error",
    );
    for (var i = 0; i < siblings.length; i++) {
      var sibling = siblings[i];
      if (sibling === control) {
        continue;
      }
      var siblingDescribedby = sibling.getAttribute("aria-describedby") || "";
      var sharesList = false;
      var controlIds = describedby.replace(/^\s+|\s+$/g, "").split(/\s+/);
      for (var j = 0; j < controlIds.length; j++) {
        if (
          siblingDescribedby.indexOf(controlIds[j]) !== -1 &&
          document.getElementById(controlIds[j]) &&
          document
            .getElementById(controlIds[j])
            .classList.contains("field__error")
        ) {
          sharesList = true;
          break;
        }
      }
      if (!sharesList) {
        continue;
      }
      sibling.classList.remove("input--error");
      sibling.classList.remove("select__control--error");
      sibling.removeAttribute("aria-invalid");
      sibling.removeAttribute("aria-describedby");
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
