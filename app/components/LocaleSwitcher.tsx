'use client';

import { usePathname, useRouter } from 'next-intl/client';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('LocaleSwitcher');

  const toggleLocale = () => {
    const newLocale = pathname.startsWith('/pt') ? 'en' : 'pt';
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLocale}
            className="h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            aria-label={t('toggleLanguage')}
          >
            <Globe className="h-5 w-5 transition-transform hover:rotate-12" />
            <span className="sr-only">{t('toggleLanguage')}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('toggleLanguage')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 