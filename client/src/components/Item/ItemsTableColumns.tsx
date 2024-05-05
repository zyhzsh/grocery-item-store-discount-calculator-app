import { Item } from '@/common/types';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ItemType } from '@/common/enums';
import AddNewPriceDialog from './dialogs/AddNewPriceDialog';
import AddItemToOrderDialog from './dialogs/AddItemToOrderDialog';
import { differenceInDays } from 'date-fns';
import RemovePriceDialog from './dialogs/RemovePriceDialog';
import axios from 'axios';
import { useStore } from '@/useStore';
import { FC } from 'react';
import { useToast } from '../ui/use-toast';
export const ItemsTableColumns: ColumnDef<Item>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const item = row.original;
      const { name, productionDate } = item;
      if (item.type === ItemType.BREAD)
        return `${name}  (Bread Age: ${differenceInDays(
          new Date(),
          productionDate
        )})`;

      return name;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const item = row.original;
      const { type } = item;

      switch (type) {
        case ItemType.BEER:
          return <Badge className="bg-amber-400">{type}</Badge>;
        case ItemType.BREAD:
          return <Badge className="bg-yellow-900">{type}</Badge>;
        case ItemType.VEGETABLE:
          return <Badge className="bg-lime-600">{type}</Badge>;
      }
    },
  },
  {
    accessorKey: 'productionDate',
    header: 'Production Date',
    cell: ({ row }) => {
      const item = row.original;
      const { productionDate } = item;
      // Creating a new Date object
      const date = new Date(productionDate);

      // Extracting year, month, and day
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-indexed, add 1 to adjust
      const day = date.getDate().toString().padStart(2, '0');

      // Formatting to "year-month-day"
      const formattedDate = `${year}-${month}-${day}`;

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'brandOriginCountry',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'prices',
    header: 'Prices',
    cell: ({ row }) => {
      const item = row.original;
      const { prices } = item;
      return (
        <div>
          {prices.map((price) => {
            return (
              <Badge key={price.id} className="block my-1">
                {price.value} {price.currency} / {price.unit}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <AddNewPriceDialog item={item} />
            <DropdownMenuSeparator />
            <AddItemToOrderDialog item={item} />

            {item.prices.length > 1 && (
              <>
                <DropdownMenuSeparator /> <RemovePriceDialog item={item} />
              </>
            )}
            <DropdownMenuSeparator />
            <RemoveItemButton item={item} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type RemoveItemButtonProps = {
  item: Item;
};

export const RemoveItemButton: FC<RemoveItemButtonProps> = ({ item }) => {
  const { items, removeOrderItem, setItems } = useStore();
  const { toast } = useToast();
  return (
    <Button
      variant={'destructive'}
      className="w-full"
      onClick={async () => {
        try {
          await axios.delete(`http://localhost:3000/items/${item.id}`);

          setItems(items.filter((i) => i.id !== item.id));
          toast({
            title: `successfully deleted`,
          });
          removeOrderItem(item);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: `${error}`,
          });
        }
      }}
    >
      Delete Item
    </Button>
  );
};
