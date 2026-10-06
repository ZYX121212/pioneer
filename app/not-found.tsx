import { SiteHeader, SiteFooter } from "./components/SiteChrome";
import Link from "next/link";
export default function NotFound() {
  return <main><SiteHeader/><div className="product-shell"><section className="product-panel"><span className="section-index">404 / PIONEER</span><h1>暂时找不到这个页面</h1><p>Page not found. 你可以返回首页，继续寻找创业资源。</p><Link className="product-button" href="/">返回首页 / Back to home →</Link></section></div><SiteFooter/></main>;
}
