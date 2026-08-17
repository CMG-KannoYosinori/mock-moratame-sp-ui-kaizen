/**
 * jQuery Mobile パネルの代替（オフキャンバス）。jQuery / jQM に依存しない。
 *
 * 本番配置: /s/js/drawer.js
 * 読み込み: DOM 内の #r-panel / #js-drawer-overlay の後。defer 可。
 *
 * 契約:
 * - 開くボタン: #build-menu-button
 * - パネル: #r-panel.js-drawer-panel
 * - オーバーレイ: #js-drawer-overlay
 * - 開いているとき: パネルに .is-open、body に .js-drawer-open
 */
(function () {
  var overlay = document.getElementById('js-drawer-overlay');
  var panel = document.getElementById('r-panel');
  if (!overlay || !panel) return;

  function openDrawer(e) {
    e.preventDefault();
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
    document.body.classList.add('js-drawer-open');
  }

  function closeDrawer() {
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
    document.body.classList.remove('js-drawer-open');
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var openBtn = t.closest('#build-menu-button');
    if (openBtn) {
      openDrawer(e);
      return;
    }
    if (e.target === overlay) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
})();
