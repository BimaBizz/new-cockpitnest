"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { localePath } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function Navbar({
  settings,
  menuItems,
  locale,
  locales,
  preview,
  proPagesEnabled,
  multiLanguageEnabled,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 p-4 w-full max-w-7xl mx-auto relative">
      <div className='rounded-full bg-card/80 backdrop-blur mx-auto w-full max-w-6xl shadow-sm border border-border/40'>
        <div className="mx-auto flex items-center justify-between gap-6 px-6 md:px-11 py-4">
          <Link
            href={localePath(locale, "", multiLanguageEnabled)}
            className="font-semibold tracking-tight text-lg"
          >
            {settings.site_title || "Cockpit Site"}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {!proPagesEnabled && (
              <Link 
                href={localePath(locale, "blog", multiLanguageEnabled)}
                className="hover:text-primary transition-colors"
              >
                Blog
              </Link>
            )}
            {menuItems.slice(0, 4).map((item) => (
              <Link
                key={item._id || item.slug}
                href={localePath(locale, item.slug, multiLanguageEnabled)}
                className="hover:text-primary transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className={`flex ${multiLanguageEnabled ? "" : ""} items-center gap-4`}>
            {/* Desktop Language Switcher */}
            {!multiLanguageEnabled ? (
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
                {locales.map((entry) => (
                  <Link
                    key={entry}
                    href={localePath(entry, "", multiLanguageEnabled)}
                    className={
                      entry === locale 
                        ? "bg-primary text-primary-foreground px-2 py-0.5 rounded" 
                        : "opacity-70 hover:opacity-100 transition-opacity"
                    }
                  >
                    {entry.toUpperCase()}
                  </Link>
                ))}
              </div>
            ) : (
              <button
                className="rounded-full bg-gradient-to-r from-green-700 to-green-500 px-4 py-2 text-xs md:text-sm tracking-wide text-white font-semibold"
              >
                Hire Me
              </button>
            )}

            {preview && (
              <span className="hidden md:inline-block rounded bg-amber-200 px-2 py-1 text-[10px] uppercase font-bold text-amber-950">
                Draft
              </span>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 p-4 bg-card/80 backdrop-blur-xl rounded-3xl border border-border/40 shadow-xl animate-in fade-in zoom-in duration-200">
          <nav className="flex flex-col gap-4">
            {!proPagesEnabled && (
              <Link 
                href={localePath(locale, "blog", multiLanguageEnabled)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-xl transition-colors uppercase tracking-wide hover:text-green-500"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            )}
            {menuItems.map((item) => (
              <Link
                key={item._id || item.slug}
                href={localePath(locale, item.slug, multiLanguageEnabled)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-xl transition-colors uppercase tracking-wide hover:text-green-500"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            
            {multiLanguageEnabled && (
              <div className="border-t border-border mt-2 pt-4 px-4">
                <p className="text-[10px] uppercase font-bold opacity-50 mb-2">Language</p>
                <div className="flex gap-4">
                  {locales.map((entry) => (
                    <Link
                      key={entry}
                      href={localePath(entry, "", multiLanguageEnabled)}
                      className={`text-sm font-medium ${
                        entry === locale ? "text-primary" : "opacity-70"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {entry.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {preview && (
              <div className="px-4 mt-2">
                <span className="inline-block rounded bg-amber-200 px-2 py-1 text-[10px] uppercase font-bold text-amber-950">
                  Draft Mode Active
                </span>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
