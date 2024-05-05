import { Country, Currency, ItemType, Unit } from '@/common/enums';
import { FC, useState } from 'react';
import ItemNameInput from '../item/ItemNameInput';
import { Button } from '../../ui/button';
import ItemTypeInput from '../item/ItemTypeInput';
import ItemBrandCountryInput from '../item/ItemBrandCountryInput';
import ItemProductionDateInput from '../item/ItemProductionDateInput';
import ItemCurrencyInput from '../item/ItemCurrencyInput';

import ItemPriceValueInput from '../item/ItemPriceValueInput';
import ItemUnitInput from '../item/ItemUnitInput';
import axios from 'axios';
import { Separator } from '../../ui/separator';

import { useToast } from '../../ui/use-toast';
import { useStore } from '@/useStore';
import { Label } from '@/components/ui/label';

const InitialState = {
  name: '',
  type: ItemType.BEER,
  brandOriginCountry: Country.NL,
  productionDate: new Date(),
  prices: [{ unit: Unit.PACK, currency: Currency.EUR, value: 0.01 }],
};

type Props = {
  closeForm: () => void;
};

const AddNewItemForm: FC<Props> = ({ closeForm }) => {
  const [inputs, setInputs] = useState(InitialState);
  const { toast } = useToast();
  const { addItem } = useStore();

  const handleSubmition = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('handleSubmition', inputs.prices[0]);
    try {
      const result = await axios.post('http://localhost:3000/items', inputs);
      const item = result.data;
      addItem(item);
      toast({
        title: 'Product added successfully',
        description: `product: ${item.id} ${item.name} ${item.name}`,
      });
      closeForm();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        // Handle Axios error
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `${e.response?.data?.message || 'An error occurred'}`,
        });
      } else {
        // Handle other types of errors
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `${(e as Error).message || 'An error occurred'}`,
        });
      }
    }
  };

  const handlePriceValueChange = (value: number): void => {
    const prices = inputs.prices;
    prices[0].value = value;
    setInputs({ ...inputs, prices });
  };

  const handleUnitChange = (unit: Unit): void => {
    const prices = inputs.prices;
    prices[0].unit = unit;
    setInputs({ ...inputs, prices });
  };

  const handleCurrencyChange = (currency: Currency): void => {
    console.log(currency);
    const prices = inputs.prices;
    prices[0].currency = currency;
    setInputs({ ...inputs, prices });
  };

  const handleNameChange = (name: string): void => {
    setInputs({ ...inputs, name });
  };

  const handleTypeChange = (type: ItemType): void => {
    setInputs({ ...inputs, type });
  };

  const handleCountryChange = (brandOriginCountry: Country): void => {
    setInputs({ ...inputs, brandOriginCountry });
  };

  const handleProductionDateChange = (productionDate: Date): void => {
    setInputs({ ...inputs, productionDate });
  };

  return (
    <form onSubmit={handleSubmition}>
      <div className="grid gap-2">
        <Label>Name</Label>
        <ItemNameInput
          handleNameChange={handleNameChange}
          defaultValue={InitialState.name}
        />
        <Label>Product type</Label>
        <ItemTypeInput
          handleTypeChange={handleTypeChange}
          defaultValue={InitialState.type}
        />
        <Label>Brand of origin</Label>
        <ItemBrandCountryInput
          handleCountryChange={handleCountryChange}
          defaultValue={InitialState.brandOriginCountry}
        />
        <Label>Production date</Label>
        <ItemProductionDateInput
          handleProductionDateChange={handleProductionDateChange}
          defaultValue={InitialState.productionDate}
        />

        <Separator className="mt-4" />
        <br />

        <Label>Currency</Label>
        <ItemCurrencyInput
          defaultValue={InitialState.prices[0].currency}
          handleCurrencyChange={handleCurrencyChange}
        />
        <Label>Unit</Label>
        <ItemUnitInput
          defaultValue={InitialState.prices[0].unit}
          handleUnitChange={handleUnitChange}
        />
        <Label>Unit Price</Label>
        <ItemPriceValueInput
          defaultValue={InitialState.prices[0].value}
          handlePriceValueChange={handlePriceValueChange}
        />
        <Button type="submit" className="w-full">
          Add Item
        </Button>
      </div>
    </form>
  );
};

export default AddNewItemForm;
