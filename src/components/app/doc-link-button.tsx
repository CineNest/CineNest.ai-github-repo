'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface DocLinkButtonProps {
  baseUrl: string;
  gid: string;
}

export function DocLinkButton({ baseUrl, gid }: DocLinkButtonProps) {
  const sheetUrl = `${baseUrl}/edit#gid=${gid}`;
  return (
    <a href={sheetUrl} target="_blank" rel="noopener noreferrer">
      <Button className="w-full">
        Generate Document
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </a>
  );
}