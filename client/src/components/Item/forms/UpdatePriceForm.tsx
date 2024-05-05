import { Currency, ITEM_UNIT_OPTIONS, Unit } from '@/common/enums';
import { Item } from '@/common/types';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/useStore';
import React, { FC, useState } from 'react';
import axios from 'axios';
import ItemUnitInput from '../item/ItemUnitInput';
import ItemCurrencyInput from '../item/ItemCurrencyInput';
import ItemPriceValueInput from '../item/ItemPriceValueInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type Props = {
  closeForm: () => void;
  item: Item;
};
const UpdatePriceForm: FC<Props> = ({ closeForm, item }) => {
  const { toast } = useToast();
  const [unit, setUnit] = useState(ITEM_UNIT_OPTIONS[item.type][0]);
  const [currency, setCurrency] = useState(Currency.EUR);
  const [unitPrice, setUnitPrice] = useState(0.01);
  const { setItems, items, updateOrderItemValue } = useStore();

  const handleCurrencyChange = (currency: Currency) => {
    setCurrency(currency);
  };
  const handleUnitChange = (unit: Unit) => {
    setUnit(unit);
  };
  const handleItemInputValueChange = (value: number) => {
    setUnitPrice(value);
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPrice = {
      itemId: item.id,
      unit: unit,
      currency: currency,
      value: unitPrice,
    };

    try {
      const result = await axios.post(
        'http://localhost:3000/items/prices',
        newPrice
      );
      toast({
        title: 'Update request successful',
      });

      const updatedPrice = result.data;

      // Iterate over item's prices
      for (let i = 0; i < item.prices.length; i++) {
        // If finds the price, then replace the old one with updatedPrice
        if (item.prices[i].id === updatedPrice.id) {
          item.prices[i] = updatedPrice;
          break;
        }
      }

      // If the updated price is not in the item's prices, push the new price into the item
      if (!item.prices.some((price) => price.id === updatedPrice.id)) {
        item.prices.push(updatedPrice);
      }

      // Update the items
      const newItems = items.map((i) =>
        i.id === item.id ? { ...i, prices: item.prices } : i
      );

      setItems(newItems);
      // Update the order items that might be affected by this price change
      updateOrderItemValue(item, unit, currency, unitPrice);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: `${error}`,
      });
    }
    closeForm();
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="grid gap-2">
        <Label>Currency</Label>
        <ItemCurrencyInput
          defaultValue={currency}
          handleCurrencyChange={handleCurrencyChange}
        />
        <Label>Unit</Label>
        <ItemUnitInput
          handleUnitChange={handleUnitChange}
          itemType={item.type}
        />

        <Label>Unit Price</Label>
        <ItemPriceValueInput
          defaultValue={unitPrice}
          handlePriceValueChange={handleItemInputValueChange}
        />
        <Button type="submit" className="w-full">
          Add/Update Price
        </Button>
      </div>
    </form>
  );
};

export default UpdatePriceForm;
