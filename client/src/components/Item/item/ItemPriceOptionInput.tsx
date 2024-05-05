import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ItemPrice } from '@/common/types';

type PriceOptionInputProps = {
  itemPrices: ItemPrice[];
  onSelect: (priceId: string) => void;
};

const ItemPriceOptionInput = ({
  itemPrices,
  onSelect,
}: PriceOptionInputProps) => {
  return (
    <Select
      required
      onValueChange={(e) => {
        onSelect(e);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a price" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {itemPrices.map((item) => {
            if (item.id) {
              return (
                <SelectItem key={item.id} value={item.id}>
                  {item.value} {item.currency} / {item.unit}
                </SelectItem>
              );
            }
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ItemPriceOptionInput;
