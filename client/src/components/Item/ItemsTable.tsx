import { DataTable } from '../ui/data-table';
import { ItemsTableColumns } from './ItemsTableColumns';
import AddNewItemDialog from './dialogs/AddNewItemDialog';
import { useStore } from '../../useStore';
const ItemsTable = () => {
  const { items } = useStore();

  return (
    <div className="m-4">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Items</h1>
        <AddNewItemDialog />
      </div>
      <DataTable columns={ItemsTableColumns} data={items} />
    </div>
  );
};

export default ItemsTable;
