import * as React from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>): JSX.Element {
  return (
    <div className='relative w-full overflow-auto'>
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}

export const TableHeader = (props: React.HTMLAttributes<HTMLTableSectionElement>): JSX.Element => <thead {...props} />;
export const TableBody = (props: React.HTMLAttributes<HTMLTableSectionElement>): JSX.Element => <tbody {...props} />;
export const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>): JSX.Element => (
  <tr className={cn('border-b transition-colors hover:bg-muted/40', className)} {...props} />
);
export const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>): JSX.Element => (
  <th className={cn('h-10 px-2 text-left align-middle font-medium text-muted-foreground', className)} {...props} />
);
export const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>): JSX.Element => (
  <td className={cn('p-2 align-middle', className)} {...props} />
);
