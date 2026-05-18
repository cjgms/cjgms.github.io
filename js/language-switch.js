(function () {
  var zhPrefix = '/zh-cn/';
  var enResume = '/files/resume.pdf';
  var zhResume = '/files/resume_cn.pdf';

  function normalizedPath(path) {
    var cleanPath = path || '/';
    cleanPath = cleanPath.replace(/\/index\.html$/, '/');
    if (!/\.[^/]+$/.test(cleanPath) && !cleanPath.endsWith('/')) cleanPath += '/';
    return cleanPath;
  }

  function isZhPage() {
    return normalizedPath(window.location.pathname).startsWith(zhPrefix);
  }

  function mapToZh(path) {
    var cleanPath = normalizedPath(path);
    var map = {
      '/': '/zh-cn/',
      '/portfolio/': '/zh-cn/portfolio/',
      '/about/': '/zh-cn/about/',
      '/2026/03/15/StarsandIsland/': '/zh-cn/projects/starsand-island/',
      '/2026/03/15/replica/': '/zh-cn/projects/replica/'
    };
    return map[cleanPath] || '/zh-cn/';
  }

  function mapToEn(path) {
    var cleanPath = normalizedPath(path);
    var map = {
      '/zh-cn/': '/',
      '/zh-cn/portfolio/': '/portfolio/',
      '/zh-cn/about/': '/about/',
      '/zh-cn/projects/starsand-island/': '/2026/03/15/StarsandIsland/',
      '/zh-cn/projects/replica/': '/2026/03/15/replica/'
    };
    return map[cleanPath] || '/';
  }

  function setMenuItem(anchor, href, label) {
    anchor.setAttribute('href', href);
    var labelNode = anchor.querySelector('span');
    if (labelNode) {
      labelNode.textContent = ' ' + label;
    }
  }

  function getAnchorPath(anchor) {
    try {
      return normalizedPath(new URL(anchor.getAttribute('href'), window.location.origin).pathname);
    } catch (error) {
      return '';
    }
  }

  function tuneMenuForLanguage(zh) {
    var labels = zh
      ? {
          home: '首页',
          portfolio: '作品集',
          about: '关于',
          resume: '简历'
        }
      : {
          home: 'Home',
          portfolio: 'Portfolio',
          about: 'About',
          resume: 'Resume'
        };

    document.querySelectorAll('.menus_items a.site-page').forEach(function (anchor) {
      if (anchor.closest('.language-switch-item')) return;

      var text = (anchor.textContent || '').trim();
      var path = getAnchorPath(anchor);

      if (path === '/' || path === '/zh-cn/' || text === 'Home' || text === '首页') {
        setMenuItem(anchor, zh ? '/zh-cn/' : '/', labels.home);
      } else if (path === '/portfolio/' || path === '/zh-cn/portfolio/' || text === 'Portfolio' || text === '作品集') {
        setMenuItem(anchor, zh ? '/zh-cn/portfolio/' : '/portfolio/', labels.portfolio);
      } else if (path === '/about/' || path === '/zh-cn/about/' || text === 'About' || text === '关于') {
        setMenuItem(anchor, zh ? '/zh-cn/about/' : '/about/', labels.about);
      } else if (path === enResume || path === zhResume || text === 'Resume' || text === '中文简历' || text === '简历') {
        setMenuItem(anchor, zh ? zhResume : enResume, labels.resume);
      }
    });
  }

  function tuneResumeLinks(zh) {
    var target = zh ? zhResume : enResume;
    var label = zh ? '简历' : 'Resume';

    document.querySelectorAll('a[href]').forEach(function (anchor) {
      var path = getAnchorPath(anchor);
      if (path !== enResume && path !== zhResume) return;

      anchor.setAttribute('href', target);

      if (anchor.classList.contains('btn-secondary')) {
        var span = anchor.querySelector('span');
        if (span) span.textContent = zh ? '下载简历' : 'Download Resume';
        return;
      }

      if (anchor.classList.contains('btn-resume')) {
        var textNodes = Array.prototype.filter.call(anchor.childNodes, function (node) {
          return node.nodeType === Node.TEXT_NODE;
        });
        if (textNodes.length) {
          textNodes[textNodes.length - 1].nodeValue = ' ' + (zh ? '简历 / CV' : 'Resume / CV');
        }
        return;
      }

      var menuSpan = anchor.querySelector('span');
      if (menuSpan) {
        menuSpan.textContent = ' ' + label;
        return;
      }

      var directTextNodes = Array.prototype.filter.call(anchor.childNodes, function (node) {
        return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim();
      });
      if (directTextNodes.length) {
        directTextNodes[directTextNodes.length - 1].nodeValue = ' ' + label;
      }
    });
  }

  function ensureLanguageSwitch(zh) {
    var target = zh ? mapToEn(window.location.pathname) : mapToZh(window.location.pathname);
    target += window.location.search + window.location.hash;
    var label = zh ? 'English' : '中文';

    document.querySelectorAll('.menus_items').forEach(function (container) {
      var item = container.querySelector('.language-switch-item');
      if (!item) {
        item = document.createElement('div');
        item.className = 'menus_item language-switch-item';
        container.appendChild(item);
      }

      item.innerHTML =
        '<a class="site-page lang-switch" href="' +
        target +
        '"><i class="fa-fw fas fa-language"></i><span> ' +
        label +
        '</span></a>';
    });
  }

  function tuneLocalizedCopy(zh) {
    var siteTitle = document.querySelector('#site-info #site-title');
    var siteBio = document.querySelector('#site-info #site-bio');
    var authorName = document.querySelector('#aside-content .author-info-name');
    var authorDescription = document.querySelector('#aside-content .author-info-description');

    if (siteTitle) siteTitle.textContent = zh ? '陈建基 | 作品集' : 'Jianji Chen | Portfolio';
    if (siteBio) siteBio.textContent = zh ? '游戏策划 | 独立开发者' : 'Game Designer | Indie Developer';
    if (authorName) authorName.textContent = zh ? '作者：Jianji Chen' : 'Jianji Chen';
    if (authorDescription) authorDescription.textContent = zh ? '初级游戏策划 & 独立开发者' : 'Junior Game Designer & Indie Developer';
  }

  function applyLanguageUI() {
    var zh = isZhPage();
    document.documentElement.setAttribute('lang', zh ? 'zh-CN' : 'en');
    tuneMenuForLanguage(zh);
    tuneResumeLinks(zh);
    ensureLanguageSwitch(zh);
    tuneLocalizedCopy(zh);
  }

  document.addEventListener('DOMContentLoaded', applyLanguageUI);
  document.addEventListener('pjax:complete', applyLanguageUI);
})();
