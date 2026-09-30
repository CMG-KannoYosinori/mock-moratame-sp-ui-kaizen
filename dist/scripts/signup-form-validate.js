/**
 * 会員登録の基本情報入力（モック）用フロントバリデーション。
 * メール・パスワード・生年月日は blur（セレクトはエリア外へ focusout）で検証し、
 * signup-form-error と同じ .field__error / Modifier / aria で出す。
 * 同一メール登録済みなどサーバー判定は扱わない。
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

  function unique(messages) {
    var seen = {};
    var out = [];
    for (var i = 0; i < messages.length; i++) {
      var msg = messages[i];
      if (!seen[msg]) {
        seen[msg] = true;
        out.push(msg);
      }
    }
    return out;
  }

  function setControlError(control, on) {
    if (!control) {
      return;
    }
    if (control.tagName === "SELECT") {
      control.classList.toggle("select__control--error", on);
    } else {
      control.classList.toggle("input--error", on);
    }
  }

  function fillErrorList(list, messages) {
    list.innerHTML = "";
    var items = unique(messages);
    for (var i = 0; i < items.length; i++) {
      var li = document.createElement("li");
      li.className = "field__error-item";
      li.textContent = items[i];
      list.appendChild(li);
    }
    list.hidden = items.length === 0;
    return items.length > 0;
  }

  function bindControlErrors(control, listId, messages) {
    var list = document.getElementById(listId);
    if (!control || !list) {
      return;
    }

    var hasError = fillErrorList(list, messages);
    setControlError(control, hasError);
    if (hasError) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", listId);
    } else {
      control.removeAttribute("aria-invalid");
      control.removeAttribute("aria-describedby");
    }
  }

  function clearControlErrors(control, listId) {
    bindControlErrors(control, listId, []);
  }

  function isEmailFormat(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isHalfWidthAlnum(value) {
    return /^[A-Za-z0-9]+$/.test(value);
  }

  function hasSequentialRun(value) {
    var s = String(value).toLowerCase();
    if (s.length < 2) {
      return false;
    }
    if (/^(.)\1+$/.test(s)) {
      return true;
    }
    for (var i = 0; i < s.length - 2; i++) {
      var a = s.charCodeAt(i);
      var b = s.charCodeAt(i + 1);
      var c = s.charCodeAt(i + 2);
      if (b - a === 1 && c - b === 1) {
        return true;
      }
      if (a - b === 1 && b - c === 1) {
        return true;
      }
    }
    return false;
  }

  function selectValue(select) {
    if (!select || select.selectedIndex < 0) {
      return "";
    }
    var option = select.options[select.selectedIndex];
    return option && option.value ? String(option.value) : "";
  }

  function isValidDate(year, month, day) {
    var y = Number(year);
    var m = Number(month);
    var d = Number(day);
    if (!y || !m || !d) {
      return false;
    }
    var date = new Date(y, m - 1, d);
    return (
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d
    );
  }

  function validateEmailArea(root, focusTarget) {
    var email = root.querySelector("#email");
    var email2 = root.querySelector("#email2");
    if (!email || !email2) {
      return;
    }

    var emailMessages = [];
    var email2Messages = [];
    var emailValue = email.value.replace(/^\s+|\s+$/g, "");
    var email2Value = email2.value.replace(/^\s+|\s+$/g, "");
    var checkEmail = !focusTarget || focusTarget === email || emailValue !== "";
    var checkEmail2 =
      !focusTarget || focusTarget === email2 || email2Value !== "";

    if (checkEmail) {
      if (!emailValue) {
        emailMessages.push("E-mailは必須入力です。");
      } else if (!isEmailFormat(emailValue)) {
        emailMessages.push("E-mailが正しくありません。");
      }
    }

    if (checkEmail2) {
      if (!email2Value) {
        email2Messages.push("E-mailは必須入力です。");
      } else if (!isEmailFormat(email2Value)) {
        email2Messages.push("E-mailが正しくありません。");
      } else if (emailValue && email2Value && emailValue !== email2Value) {
        email2Messages.push("E-mailが正しくありません。");
      }
    }

    if (focusTarget === email) {
      bindControlErrors(email, "email-error", emailMessages);
      return;
    }
    if (focusTarget === email2) {
      bindControlErrors(email2, "email2-error", email2Messages);
      return;
    }
    bindControlErrors(email, "email-error", emailMessages);
    bindControlErrors(email2, "email2-error", email2Messages);
  }

  function validatePasswordArea(root) {
    var input = root.querySelector("#password1");
    if (!input) {
      return;
    }

    var value = input.value;
    var messages = [];

    if (!value) {
      messages.push("パスワードは必須入力です。");
    } else {
      if (!isHalfWidthAlnum(value)) {
        messages.push("パスワードは半角英数字で入力して下さい");
      }
      if (value.length < 6) {
        messages.push("パスワードは6文字以上で入力して下さい");
      }
      if (
        isHalfWidthAlnum(value) &&
        value.length >= 6 &&
        value.length <= 16 &&
        hasSequentialRun(value)
      ) {
        messages.push("パスワードは連番以外で入力してください。");
      }
    }

    bindControlErrors(input, "password1-error", messages);
  }

  function validateBirthdayArea(root) {
    var year = root.querySelector('select[name="yyyy"]');
    var month = root.querySelector('select[name="mm"]');
    var day = root.querySelector('select[name="dd"]');
    var list = document.getElementById("birthday-error");
    if (!year || !month || !day || !list) {
      return;
    }

    var y = selectValue(year);
    var m = selectValue(month);
    var d = selectValue(day);
    var messages = [];

    if (!y || !m || !d || !isValidDate(y, m, d)) {
      messages.push("生年月日を正しく選択してください。");
    }

    var hasError = fillErrorList(list, messages);
    var controls = [year, month, day];
    for (var i = 0; i < controls.length; i++) {
      setControlError(controls[i], hasError);
      if (hasError) {
        controls[i].setAttribute("aria-invalid", "true");
        controls[i].setAttribute("aria-describedby", "birthday-error");
      } else {
        controls[i].removeAttribute("aria-invalid");
        controls[i].removeAttribute("aria-describedby");
      }
    }
  }

  function clearEmailControl(target) {
    if (target.id === "email") {
      clearControlErrors(target, "email-error");
      return;
    }
    if (target.id === "email2") {
      clearControlErrors(target, "email2-error");
    }
  }

  document.addEventListener("focusout", function (event) {
    var target = event.target;
    if (!target || !target.classList) {
      return;
    }

    if (target.classList.contains("input")) {
      var inputRoot = closest(target, ".select-email, .select-password");
      if (!inputRoot) {
        return;
      }
      if (inputRoot.classList.contains("select-email")) {
        validateEmailArea(inputRoot, target);
        return;
      }
      if (inputRoot.classList.contains("select-password")) {
        validatePasswordArea(inputRoot);
      }
      return;
    }

    if (target.classList.contains("select__control")) {
      var birthdayRoot = closest(target, ".select-birthday");
      if (!birthdayRoot) {
        return;
      }
      var next = event.relatedTarget;
      if (next && birthdayRoot.contains(next)) {
        return;
      }
      validateBirthdayArea(birthdayRoot);
    }
  });

  document.addEventListener("input", function (event) {
    var target = event.target;
    if (!target || !target.classList || !target.classList.contains("input")) {
      return;
    }
    if (closest(target, ".select-email")) {
      clearEmailControl(target);
      return;
    }
    if (closest(target, ".select-password")) {
      clearControlErrors(target, "password1-error");
    }
  });

  document.addEventListener("change", function (event) {
    var target = event.target;
    if (
      !target ||
      !target.classList ||
      !target.classList.contains("select__control")
    ) {
      return;
    }
    var root = closest(target, ".select-birthday");
    if (!root || !target.classList.contains("select__control--error")) {
      return;
    }
    var list = document.getElementById("birthday-error");
    if (list) {
      list.hidden = true;
      list.innerHTML = "";
    }
    var controls = root.querySelectorAll("select.select__control");
    for (var i = 0; i < controls.length; i++) {
      setControlError(controls[i], false);
      controls[i].removeAttribute("aria-invalid");
      controls[i].removeAttribute("aria-describedby");
    }
  });
})();
