import { addDays, format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

type Props = {
  handleProductionDateChange: (date: Date) => void;
  defaultValue: Date;
};

const ItemProductionDateInput: React.FC<Props> = ({
  handleProductionDateChange,
  defaultValue,
}) => {
  const [date, setDate] = useState<Date>(defaultValue);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Production Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(day) => {
            setDate(addDays(new Date(), parseInt(day)));
            handleProductionDateChange(addDays(new Date(), parseInt(day)));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="-1">Yesterday</SelectItem>
            <SelectItem value="-2">2 Days ago</SelectItem>
            <SelectItem value="-3">3 Days ago</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            disabled={(date) =>
              date >= new Date() || date < new Date('1900-01-01')
            }
            onSelect={(date) => {
              setDate(date!);
              handleProductionDateChange(date!);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ItemProductionDateInput;
