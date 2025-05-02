'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';
import { LocaleSwitcher } from '@/app/components/LocaleSwitcher';

export function Header() {
  const t = useTranslations('Header');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link 
          href="/about" 
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {t('about')}
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
} 