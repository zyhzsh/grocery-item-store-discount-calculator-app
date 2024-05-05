import Decimal from 'decimal.js';
import { ItemType } from '@/common/enums';
import { useStore } from '@/useStore';
import { differenceInDays } from 'date-fns';
const OrderItems = () => {
  const { orderItems } = useStore();

  return (
    <>
      {orderItems.map((orderItem, index) => {
        const priceValue = orderItem.price.value || 0; // Default to 0 if undefined
        return (
          <li key={index} className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {orderItem.item.name}{' '}
              {orderItem.item.type === ItemType.BEER && (
                <>({orderItem.item.brandOriginCountry})</>
              )}
              {orderItem.item.type === ItemType.BREAD && (
                <>
                  (Age:
                  {differenceInDays(
                    new Date(),
                    new Date(orderItem.item.productionDate)
                  )}
                  days)
                </>
              )}
              x
              <span>
                {orderItem.quantity} {orderItem.price.unit}
              </span>
            </span>
            <span>
              {new Decimal(orderItem.quantity * priceValue).toFixed(2)}{' '}
              {orderItem.currency}
            </span>
          </li>
        );
      })}
    </>
  );
};
export default OrderItems;
