import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FC } from 'react';
import { Currency } from '@/common/enums';

type Props = {
  handleCurrencyChange: (currency: Currency) => void;
  defaultValue?: Currency;
};

const ItemCurrencyInput: FC<Props> = ({
  handleCurrencyChange,
  defaultValue,
}) => {
  return (
    <Select
      required
      defaultValue={defaultValue ? defaultValue : Currency.EUR}
      onValueChange={(type: Currency) => {
        handleCurrencyChange(type);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.keys(Currency).map((type) => {
            return (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ItemCurrencyInput;
