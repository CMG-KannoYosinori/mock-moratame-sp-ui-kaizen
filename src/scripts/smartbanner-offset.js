/**
 * no-jqm ページ向け Smart Banner オフセット補正。
 *
 * Smart Banner の自動 positioning を止めたページで、
 * バナーの高さ分だけ `.smartbanner-offset` を top で下げる。
 * `.page` は本番 CSS の詳細度が高いため使わない。
 */
(function () {
  var smartBannerOriginalPosition = '';
  var smartBannerOriginalTop = '';
  var rootSelector = '.smartbanner-offset';

  function applySmartBannerOffsetToPage() {
    var root = document.querySelector(rootSelector);
    var banner = document.querySelector('.js_smartbanner');

    if (!root || !banner) {
      return;
    }

    if (!smartBannerOriginalPosition) {
      smartBannerOriginalPosition = root.style.position;
    }

    if (!smartBannerOriginalTop) {
      smartBannerOriginalTop = root.style.top;
    }

    if (getComputedStyle(root).position === 'static') {
      root.style.position = 'relative';
    }

    root.style.top = banner.offsetHeight + 'px';
    document.documentElement.style.marginTop = '';
  }

  function queueSmartBannerOffset() {
    window.requestAnimationFrame(applySmartBannerOffsetToPage);
  }

  function resetSmartBannerOffset() {
    var root = document.querySelector(rootSelector);

    if (!root) {
      return;
    }

    root.style.position = smartBannerOriginalPosition;
    root.style.top = smartBannerOriginalTop;
  }

  window.addEventListener('load', queueSmartBannerOffset);
  document.addEventListener('smartbanner.view', queueSmartBannerOffset);
  document.addEventListener('smartbanner.exit', resetSmartBannerOffset);
})();
