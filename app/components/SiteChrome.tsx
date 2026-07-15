/* eslint-disable @next/next/no-html-link-for-pages */
export function SiteHeader() {
  return (
    <>
      <div className="announcement">
        <span>创业指南上线</span>
        <p>从发现机会，到理解创业下一步</p>
      </div>
      <header className="site-header">
        <a className="brand" href="/#top" aria-label="Pioneer 首页">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PIONEER</span>
        </a>
        <nav aria-label="主导航">
          <a href="/knowledge">创业指南</a>
          <a href="/programs">开放计划</a>
          <a href="/organizations">孵化机构</a>
          <a href="/events">创业活动</a>
          <a href="/startups">创业项目</a>
        </nav>
        <a className="submit-link" href="/#submit">
          提交资源 <span aria-hidden="true">↗</span>
        </a>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer id="about">
      <div className="footer-brand">
        <span className="brand-mark">P</span>
        <div>
          <strong>PIONEER</strong>
          <p>GLOBAL STARTUP DIRECTORY &amp; FOUNDER GUIDE</p>
        </div>
      </div>
      <div className="footer-links">
        <a href="/knowledge">创业指南</a>
        <a href="/programs">开放计划</a>
        <a href="/organizations">孵化机构</a>
        <a href="/events">创业活动</a>
        <a href="/startups">创业项目</a>
      </div>
      <p className="copyright">© 2026 Pioneer. 内容最近核验：2026.07.15</p>
    </footer>
  );
}
