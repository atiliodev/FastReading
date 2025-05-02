'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('About');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* App Section */}
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-lg leading-relaxed">
              {t('appSection.p1')}
            </p>
            <p className="text-lg leading-relaxed">
              {t('appSection.p2')}
            </p>
            <p className="text-lg leading-relaxed">
              {t('appSection.p3')}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Developer Section */}
      <Separator className="my-8" />
      
      <section className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src="https://github.com/atiliodev.png"
            alt="Atilio Dev"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Atilio Dev</h2>
          <p className="text-muted-foreground max-w-md">
            {t('developerBio')}
          </p>
          <a
            href="https://github.com/atiliodev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline transition-colors"
            aria-label={t('githubProfile')}
          >
            {t('githubProfile')}
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
} 