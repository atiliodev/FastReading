import React from 'react';
import { TextElement } from '@/lib/text-processor';
import { cn } from '@/lib/utils';

interface ProcessedContentProps {
  titles: TextElement[];
  paragraphs: TextElement[];
  className?: string;
  titleClassName?: string;
  paragraphClassName?: string;
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingTag = `h${HeadingLevel}`;

const headingComponents: Record<HeadingLevel, HeadingTag> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

export function ProcessedContent({
  titles,
  paragraphs,
  className,
  titleClassName,
  paragraphClassName,
}: ProcessedContentProps) {
  return (
    <div className={cn('prose prose-slate dark:prose-invert max-w-none', className)}>
      {titles.map((title, index) => {
        const level = (title.level || 1) as HeadingLevel;
        const HeadingTag = headingComponents[level];
        return (
          <HeadingTag
            key={`title-${index}`}
            className={cn(
              'font-bold tracking-tight',
              {
                'text-4xl mb-6': level === 1,
                'text-3xl mb-5': level === 2,
                'text-2xl mb-4': level === 3,
                'text-xl mb-3': level === 4,
                'text-lg mb-2': level === 5,
                'text-base mb-2': level === 6,
              },
              titleClassName
            )}
          >
            {title.text}
          </HeadingTag>
        );
      })}

      {paragraphs.map((paragraph, index) => (
        <p
          key={`paragraph-${index}`}
          className={cn(
            'leading-7 [&:not(:first-child)]:mt-6',
            paragraphClassName
          )}
        >
          {paragraph.text}
        </p>
      ))}
    </div>
  );
} 