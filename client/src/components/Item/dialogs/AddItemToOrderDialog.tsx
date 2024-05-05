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

import { Label } from '@/components/ui/label';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Item, ItemPrice, OrderItem } from '@/common/types';

import { useToast } from '@/components/ui/use-toast';
import PriceOptionInput from '../item/ItemPriceOptionInput';
import { useStore } from '@/useStore';
import { ItemType } from '@/common/enums';
import ItemQuantityInput from '../item/ItemQuantityInput';

type Props = {
  item: Item;
};

const AddItemToOrderDialog = ({ item }: Props) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add To Order</Button>
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
            className="px-4"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add To Order</Button>
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

// function ProfileForm({
//   className,
//   item,
// }: //closeForm,
// React.ComponentProps<'form'> & { item: Item; closeForm: () => void }) {
//   const { toast } = useToast();
//   const { orderItems, addOrderItem } = useStore();
//   const { prices } = item;
//   const [selectedPrice, setSelectedPrice] = React.useState<ItemPrice | null>(
//     null
//   );
//   const { quantity, setQuantity } = React.useState<number>();

//   const handleQuantityChange = (quantity: number) => {
//     console.log(quantity);
//     setQuantity(quantity);
//   };

//   const onPriceSelected = (priceId: string) => {
//     const priceItem = prices.find((p) => p.id === priceId);
//     setSelectedPrice(priceItem!);
//   };

//   const handleOnSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const newOrderItem: OrderItem = {
//       item,
//       price: selectedPrice!,
//       currency: selectedPrice!.currency!,
//       quantity: Number(quantity),
//     };
//     if (
//       orderItems.length !== 0 &&
//       newOrderItem.currency !== orderItems[0].currency
//     ) {
//       toast({
//         variant: 'destructive',
//         title: `You already have this currency: ${orderItems[0].currency} in your order`,
//         description: ` Orders in different currencies are not supported, please change and try again.`,
//       });
//     } else {
//       if (item.type === ItemType.BEER || item.type === ItemType.BREAD) {
//         if (!Number.isInteger(newOrderItem.quantity)) {
//           toast({
//             variant: 'destructive',
//             title: `input error: ${newOrderItem.quantity}`,
//             description: `Quantity for item for ${newOrderItem.item.type} must be an integer.`,
//           });
//           return;
//         }
//       }
//       addOrderItem(newOrderItem);
//       toast({
//         title: 'Added successfully',
//       });
//     }
//   };

//   return (
//     <form
//       onSubmit={handleOnSubmit}
//       className={cn('grid items-start gap-4', className)}
//     >
//       <PriceOptionInput itemPrices={prices} onSelect={onPriceSelected} />
//       <div className="grid gap-2">
//         <Label htmlFor="value">Quanitity/Weight</Label>
//         <ItemQuantityInput
//           defaultValue={0.01}
//           handleQuantityChange={handleQuantityChange}
//         />
//       </div>
//       <Button type="submit">Add Item To Order</Button>
//     </form>
//   );
// }

function ProfileForm({
  className,
  item,
  closeForm,
}: React.ComponentProps<'form'> & { item: Item; closeForm: () => void }) {
  const { toast } = useToast();
  const { orderItems, addOrderItem } = useStore();
  const { prices } = item;
  const [selectedPrice, setSelectedPrice] = React.useState<ItemPrice | null>(
    null
  );
  const [quantity, setQuantity] = React.useState<number>(1); // Default quantity initialized to 1

  const handleQuantityChange = (quantity: number) => {
    setQuantity(quantity);
  };

  const onPriceSelected = (priceId: string) => {
    const priceItem = prices.find((p) => p.id === priceId);
    setSelectedPrice(priceItem || null);
  };

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrice || selectedPrice.currency === undefined) {
      toast({
        variant: 'destructive',
        title: 'Price selection error',
        description:
          'Please select a valid price with a defined currency before submitting.',
      });
      return;
    }

    const newOrderItem: OrderItem = {
      item,
      price: selectedPrice,
      currency: selectedPrice.currency,
      quantity: Number(quantity),
    };

    if (
      orderItems.some(
        (orderItem) => orderItem.currency !== newOrderItem.currency
      )
    ) {
      toast({
        variant: 'destructive',
        title: `Currency mismatch detected`,
        description: `Orders in different currencies are not supported.`,
      });
      return;
    }

    if (item.type === ItemType.BEER || item.type === ItemType.BREAD) {
      if (!Number.isInteger(quantity)) {
        toast({
          variant: 'destructive',
          title: 'Quantity Error',
          description: `Quantity for ${item.type} must be an integer.`,
        });
        return;
      }
    }

    addOrderItem(newOrderItem);
    toast({
      title: 'Item Added Successfully',
    });
    closeForm();
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className={cn('grid items-start gap-4', className)}
    >
      <PriceOptionInput itemPrices={prices} onSelect={onPriceSelected} />
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity/Weight</Label>
        <ItemQuantityInput
          defaultValue={quantity}
          handleQuantityChange={handleQuantityChange}
        />
      </div>
      <Button type="submit">Add Item To Order</Button>
    </form>
  );
}

export default AddItemToOrderDialog;
