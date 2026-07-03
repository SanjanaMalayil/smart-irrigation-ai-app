import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Droplets, FileDown, Info, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/translations";

export default function Header() {
  const router = useRouterState();
  const currentPath = router.location.pathname;
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-card border-b shadow-subtle sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                {t("appTitle", language)}
              </h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {t("appSubtitle", language)}
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Button
              variant={currentPath === "/" ? "default" : "ghost"}
              size="sm"
              asChild
              data-ocid="header.dashboard.link"
            >
              <Link to="/">
                <Droplets className="w-4 h-4 mr-2" />
                {t("dashboard", language)}
              </Link>
            </Button>
            <Button
              variant={currentPath === "/about" ? "default" : "ghost"}
              size="sm"
              asChild
              data-ocid="header.about.link"
            >
              <Link to="/about">
                <Info className="w-4 h-4 mr-2" />
                {t("about", language)}
              </Link>
            </Button>
            <Button
              variant={currentPath === "/export" ? "default" : "ghost"}
              size="sm"
              asChild
              data-ocid="header.export.link"
            >
              <Link to="/export">
                <FileDown className="w-4 h-4 mr-2" />
                {t("export", language)}
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              data-ocid="header.language.toggle"
              className="border-emerald-300 dark:border-emerald-700"
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === "en" ? "EN" : "HI"}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
