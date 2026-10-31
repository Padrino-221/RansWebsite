"use client";

import { useState } from "react";
import { SiteIcon } from "@/components/SiteIcon";
import { Menu, X } from "lucide-react";
import type { SiteContent } from "@/content";
import { publicAssetPath } from "@/lib/assets";

export function SiteHeader({ site }: { site: Pick<SiteContent["site"], "title" | "logo" | "brandName" | "tagline" | "navigation"> }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoPath = publicAssetPath(site.logo);

  return (
    <header className="site-header">
      <div className="site-header-inner container">
        <a className="site-brand" href="/" aria-label={`${site.title} home`}>
          <img src={logoPath} alt={site.title} />
          <span>{site.brandName}<small>{site.tagline}</small></span>
        </a>
        <button className="site-menu-toggle" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
        <nav className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {site.navigation.map((item) => <a key={item.href} className={item.isContact ? "site-nav-contact" : undefined} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}{item.isContact && <SiteIcon name="ArrowUpRight" size={16} />}</a>)}
        </nav>
      </div>
    </header>
  );
}
