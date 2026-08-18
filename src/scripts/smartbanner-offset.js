/**
 * no-jqm ページ向け Smart Banner オフセット補正。
 *
 * Smart Banner の自動 positioning を止めたページで、
 * バナーの高さ分だけ `.page` を top で下げる。
 */
(function () {
  var smartBannerOriginalPosition = '';
  var smartBannerOriginalTop = '';

  function applySmartBannerOffsetToPage() {
    var page = document.querySelector('.page');
    var banner = document.querySelector('.js_smartbanner');

    if (!page || !banner) {
      return;
    }

    if (!smartBannerOriginalPosition) {
      smartBannerOriginalPosition = page.style.position;
    }

    if (!smartBannerOriginalTop) {
      smartBannerOriginalTop = page.style.top;
    }

    if (getComputedStyle(page).position === 'static') {
      page.style.position = 'relative';
    }

    page.style.top = banner.offsetHeight + 'px';
    document.documentElement.style.marginTop = '';
  }

  function queueSmartBannerOffset() {
    window.requestAnimationFrame(applySmartBannerOffsetToPage);
  }

  function resetSmartBannerOffset() {
    var page = document.querySelector('.page');

    if (!page) {
      return;
    }

    page.style.position = smartBannerOriginalPosition;
    page.style.top = smartBannerOriginalTop;
  }

  window.addEventListener('load', queueSmartBannerOffset);
  document.addEventListener('smartbanner.view', queueSmartBannerOffset);
  document.addEventListener('smartbanner.exit', resetSmartBannerOffset);
})();
