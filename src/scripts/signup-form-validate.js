/**
 * 会員登録の基本情報入力（モック）用フロントバリデーション。
 * メール・パスワード・生年月日は blur（セレクトはエリア外へ focusout）で検証し、
 * signup-form-error と同じ .field__error / Modifier で出す。
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

  function renderErrors(root, messages, errorControls) {
    var list = root.querySelector(".field__error");
    if (!list) {
      return;
    }

    list.innerHTML = "";
    var items = unique(messages);
    for (var i = 0; i < items.length; i++) {
      var li = document.createElement("li");
      li.className = "field__error-item";
      li.textContent = items[i];
      list.appendChild(li);
    }
    list.hidden = items.length === 0;

    var controls = root.querySelectorAll("input.input, select.select__control");
    for (var c = 0; c < controls.length; c++) {
      setControlError(controls[c], false);
    }
    if (items.length === 0) {
      return;
    }
    for (var e = 0; e < errorControls.length; e++) {
      setControlError(errorControls[e], true);
    }
  }

  function clearErrors(root) {
    renderErrors(root, [], []);
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

    var messages = [];
    var errorControls = [];
    var emailValue = email.value.replace(/^\s+|\s+$/g, "");
    var email2Value = email2.value.replace(/^\s+|\s+$/g, "");
    var checkEmail = !focusTarget || focusTarget === email || emailValue !== "";
    var checkEmail2 =
      !focusTarget || focusTarget === email2 || email2Value !== "";

    if (checkEmail) {
      if (!emailValue) {
        messages.push("E-mailは必須入力です。");
        errorControls.push(email);
      } else if (!isEmailFormat(emailValue)) {
        messages.push("E-mailが正しくありません。");
        errorControls.push(email);
      }
    }

    if (checkEmail2) {
      if (!email2Value) {
        messages.push("E-mailは必須入力です。");
        errorControls.push(email2);
      } else if (!isEmailFormat(email2Value)) {
        messages.push("E-mailが正しくありません。");
        errorControls.push(email2);
      } else if (emailValue && email2Value && emailValue !== email2Value) {
        messages.push("E-mailが正しくありません。");
        errorControls.push(email2);
      }
    }

    renderErrors(root, messages, errorControls);
  }

  function validatePasswordArea(root) {
    var input = root.querySelector("#password1");
    if (!input) {
      return;
    }

    var value = input.value;
    var messages = [];
    var errorControls = [];

    if (!value) {
      messages.push("パスワードは必須入力です。");
      errorControls.push(input);
    } else {
      if (!isHalfWidthAlnum(value)) {
        messages.push("パスワードは半角英数字で入力して下さい");
        errorControls.push(input);
      }
      if (value.length < 6) {
        messages.push("パスワードは6文字以上で入力して下さい");
        errorControls.push(input);
      }
      if (
        isHalfWidthAlnum(value) &&
        value.length >= 6 &&
        value.length <= 16 &&
        hasSequentialRun(value)
      ) {
        messages.push("パスワードは連番以外で入力してください。");
        errorControls.push(input);
      }
    }

    renderErrors(root, messages, errorControls);
  }

  function validateBirthdayArea(root) {
    var year = root.querySelector('select[name="yyyy"]');
    var month = root.querySelector('select[name="mm"]');
    var day = root.querySelector('select[name="dd"]');
    if (!year || !month || !day) {
      return;
    }

    var y = selectValue(year);
    var m = selectValue(month);
    var d = selectValue(day);
    var messages = [];
    var errorControls = [];

    if (!y || !m || !d || !isValidDate(y, m, d)) {
      messages.push("生年月日を正しく選択してください。");
      errorControls.push(year, month, day);
    }

    renderErrors(root, messages, errorControls);
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
    var root = closest(target, ".select-email, .select-password");
    if (root) {
      clearErrors(root);
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
    if (root && target.classList.contains("select__control--error")) {
      clearErrors(root);
    }
  });
})();
