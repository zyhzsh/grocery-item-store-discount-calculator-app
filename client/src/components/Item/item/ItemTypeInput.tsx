import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FC } from 'react';
import { ItemType } from '@/common/enums';

type Props = {
  handleTypeChange: (type: ItemType) => void;
  defaultValue?: ItemType;
};

const ItemTypeInput: FC<Props> = ({ handleTypeChange, defaultValue }) => {
  return (
    <Select
      required
      defaultValue={defaultValue ?? defaultValue}
      onValueChange={(type: ItemType) => {
        handleTypeChange(type);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select item type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.keys(ItemType).map((type) => {
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

export default ItemTypeInput;
