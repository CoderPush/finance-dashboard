import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from './command';
import { Button } from './button';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  clearable?: boolean;
}

export function Combobox({ options, value, onChange, placeholder, clearable }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-64 justify-between"
        >
          {selected ? selected.label : (placeholder || 'Select...')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-64 p-0">
        <Command>
          <CommandInput placeholder={placeholder || 'Search...'} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {clearable && (
              <>
                <CommandItem
                  key="clear"
                  onSelect={() => {
                    onChange(undefined);
                    setOpen(false);
                  }}
                  className="text-muted-foreground"
                >
                  Clear selection
                </CommandItem>
                <div className="h-px bg-muted my-1" />
              </>
            )}
            {options.map(option => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={option.value === value ? 'font-semibold' : ''}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 