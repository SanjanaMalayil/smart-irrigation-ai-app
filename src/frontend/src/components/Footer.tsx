import { Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../i18n/translations";

export default function Footer() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            &copy; {currentYear}. {t("builtWith", language)}{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
            {t("using", language)}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-emerald-900 dark:hover:text-emerald-100 transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
