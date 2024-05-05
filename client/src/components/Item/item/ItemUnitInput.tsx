import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FC } from 'react';
import { ITEM_UNIT_OPTIONS, ItemType, Unit } from '@/common/enums';

type Props = {
  itemType?: ItemType;
  handleUnitChange: (currency: Unit) => void;
  defaultValue?: Unit;
};

const ItemUnitInput: FC<Props> = ({
  handleUnitChange,
  defaultValue,
  itemType,
}) => {
  if (itemType) {
    return (
      <Select
        required
        defaultValue={ITEM_UNIT_OPTIONS[itemType][0]}
        onValueChange={(type: Unit) => {
          handleUnitChange(type);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Unit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {ITEM_UNIT_OPTIONS[itemType].map((unit) => {
              return (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select
      required
      defaultValue={defaultValue ?? Unit.BOTTLE}
      onValueChange={(type: Unit) => {
        handleUnitChange(type);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Unit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.keys(Unit).map((type) => {
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

export default ItemUnitInput;
