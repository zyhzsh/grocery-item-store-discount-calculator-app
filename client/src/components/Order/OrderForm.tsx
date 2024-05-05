import { Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';
import OrderItems from './OrderItems';
import Decimal from 'decimal.js';
import { useStore } from '@/useStore';
import { useToast } from '../ui/use-toast';

const OrderForm = () => {
  const {
    calculatedResult,
    orderItems,
    updateCalculateResult,
    clearOrderItems,
  } = useStore();
  const { toast } = useToast();
  const handleCalculation = async () => {
    const list = orderItems.map((i) => ({
      itemId: i.item.id,
      priceId: i.price.id,
      quantity: i.quantity,
    }));

    const createdOrder = {
      currency: orderItems[0].currency,
      items: list,
    };

    try {
      const result = await axios.post(
        'http://localhost:3000/orders/',
        createdOrder
      );
      updateCalculateResult({
        ...result.data,
        currency: createdOrder.currency,
      });
    } catch (error: unknown) {
      toast({
        title: 'Invalid request',
        description: `${error}`,
      });
    }
  };

  return (
    <Card className="overflow-hidden m-4 flex-1">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="lg"
            variant="outline"
            className="h-8 gap-1"
            onClick={clearOrderItems}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Clear
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            <OrderItems />
          </ul>
          <Separator className="my-2" />
          <Button
            disabled={orderItems.length === 0}
            onClick={handleCalculation}
          >
            <Sparkles className="h-3.5 w-3.5 m-2" /> Calculate discount
          </Button>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Discount</span>
              <span>
                {new Decimal(calculatedResult.discount).toFixed(2)}
                {calculatedResult.currency}
              </span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">
                Before discount total
              </span>
              <span>
                {new Decimal(calculatedResult.beforeDiscountTotal).toFixed(2)}
                {calculatedResult.currency}
              </span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>
                {new Decimal(calculatedResult.total).toFixed(2)}
                {calculatedResult.currency}
              </span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
      </CardContent>
    </Card>
  );
};

export default OrderForm;
