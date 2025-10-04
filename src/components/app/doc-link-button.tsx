'use client';

import { Button } from '@/components/ui/button';
import { DialogTrigger } from '@/components/ui/dialog';

export function DocumentationDialog() {
  return (
    <DialogTrigger asChild>
      <Button className="w-full">
        Generate Document
      </Button>
    </DialogTrigger>
  );
}
