import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer';

import useMediaQuery from '@/hooks/useMediaQuery';
import { Item, ItemPrice } from '@/common/types';

import { useToast } from '@/components/ui/use-toast';
import PriceOptionInput from '../item/ItemPriceOptionInput';
import { useStore } from '@/useStore';

import axios from 'axios';

type Props = {
  item: Item;
};

const RemovePriceDialog = ({ item }: Props) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Remove Price</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription>
              ID: {item.id} <br />
              {item.type}
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            closeForm={() => {
              setOpen(false);
            }}
            item={item}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive">Remove Price</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DialogTitle>{item.name}</DialogTitle>
          <DialogDescription>
            ID: {item.id} <br />
            {item.type}
          </DialogDescription>
        </DrawerHeader>
        <ProfileForm
          closeForm={() => {
            setOpen(false);
          }}
          item={item}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function ProfileForm({
  className,
  item,
}: //closeForm,
React.ComponentProps<'form'> & { item: Item; closeForm: () => void }) {
  const { toast } = useToast();
  const { prices } = item;
  const { setItems, removeOrderItem, items } = useStore();
  const [currentPrices, setCurrentPrices] = React.useState(prices);
  const [selectedPrice, setSelectedPrice] = React.useState<ItemPrice | null>(
    null
  );

  const onPriceSelected = (priceId: string) => {
    const priceItem = prices.find((p) => p.id === priceId);
    setSelectedPrice(priceItem!);
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await axios.delete(
        `http://localhost:3000/items/prices/${selectedPrice!.id}`
      );
      if (result.status === 200) {
        toast({
          title: 'Update Successful',
        });
        const newPrices = currentPrices!.filter(
          (price) => price.id !== selectedPrice!.id
        );
        if (selectedPrice) {
          removeOrderItem(item, selectedPrice!.unit, selectedPrice.currency);
        }
        setCurrentPrices(newPrices);
        setSelectedPrice(null);
        const newItem = { ...item, prices: newPrices };

        const newItems = items.map((item) =>
          item.id === newItem.id ? newItem : item
        );

        setItems(newItems);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `${err}`,
      });
    }
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className={cn('grid items-start gap-4', className)}
    >
      <PriceOptionInput itemPrices={currentPrices} onSelect={onPriceSelected} />
      <Button type="submit">Delete</Button>
    </form>
  );
}
export default RemovePriceDialog;
