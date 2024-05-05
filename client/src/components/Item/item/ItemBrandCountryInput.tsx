import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FC } from 'react';
import { Country } from '@/common/enums';

type Props = {
  handleCountryChange: (type: Country) => void;
  defaultValue?: Country;
};

const ItemBrandCountryInput: FC<Props> = ({
  handleCountryChange,
  defaultValue,
}) => {
  return (
    <Select
      required
      defaultValue={defaultValue ?? defaultValue}
      onValueChange={(type: Country) => {
        handleCountryChange(type);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.keys(Country).map((type) => {
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

export default ItemBrandCountryInput;
