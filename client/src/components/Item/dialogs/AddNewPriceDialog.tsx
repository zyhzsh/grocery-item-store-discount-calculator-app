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
import { Item } from '@/common/types';
import UpdatePriceForm from '../forms/UpdatePriceForm';
import { useState } from 'react';
type Props = {
  item: Item;
};

const AddNewPriceDialog = ({ item }: Props) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Update Price</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Price For - {item.name}</DialogTitle>
            <DialogDescription>
              ID: {item.id} <br />
              {item.type}
            </DialogDescription>
          </DialogHeader>
          <UpdatePriceForm
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
        <Button variant="outline">Update Price</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DialogTitle>New Price For - {item.name}</DialogTitle>
          <DialogDescription>
            ID: {item.id} <br />
            {item.type}
          </DialogDescription>
        </DrawerHeader>
        <div className="mx-4">
          <UpdatePriceForm
            closeForm={() => {
              setOpen(false);
            }}
            item={item}
          />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddNewPriceDialog;
