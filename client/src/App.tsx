import { useEffect } from 'react';
import axios from 'axios';
import ItemsTable from './components/Item/ItemsTable';
import { Toaster } from './components/ui/toaster';
import OrderForm from './components/Order/OrderForm';
import DiscountPolicy from './components/Discount/DiscountPolicy';
import { useStore } from './useStore';

function App() {
  const { setItems } = useStore();

  const getItems = async () => {
    try {
      const result = await axios.get('http://localhost:3000/items');
      setItems(result.data); // Update state with fetched items
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="w-full">
      <ItemsTable />
      <div className="flex justify-between gap-2">
        <DiscountPolicy />
        <OrderForm />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
