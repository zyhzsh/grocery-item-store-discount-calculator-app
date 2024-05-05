import { create } from 'zustand';
import { CalculateResult, Item, OrderItem } from './common/types';
import { Currency, Unit } from './common/enums';

interface AppState {
  orderItems: OrderItem[];
  items: Item[];
  calculatedResult: CalculateResult;
  addItem: (item: Item) => void;
  setItems: (item: Item[]) => void;
  addOrderItem: (orderItem: OrderItem) => void;
  clearOrderItems: () => void;
  updateOrderItemValue: (
    item: Item,
    unit: Unit | unknown,
    currency: Currency | unknown,
    value: number | string
  ) => void;
  updateCalculateResult: (result: CalculateResult) => void;
  removeOrderItem: (
    item: Item,
    unit?: Unit | unknown,
    currency?: Currency | unknown
  ) => void;
}

export const useStore = create<AppState>((set) => ({
  orderItems: [],
  items: [],
  calculatedResult: {
    currency: '',
    discount: 0,
    beforeDiscountTotal: 0,
    total: 0,
  },
  updateCalculateResult: (result: CalculateResult) =>
    set((state) => ({
      ...state,
      calculatedResult: result,
    })),
  addItem: (item: Item) => {
    set((state) => ({
      ...state,
      items: [...state.items, item],
    }));
  },
  updateOrderItemValue: (
    item: Item,
    unit: Unit | unknown,
    currency: Currency | unknown,
    value: number | string
  ) => {
    // Convert value to a number if it is a string
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    // Validate if the value is a number after potential conversion
    if (isNaN(numericValue)) {
      console.error('Invalid value provided for item price update');
      return;
    }

    set((state) => ({
      ...state,
      orderItems: state.orderItems.map((orderItem) => {
        if (
          orderItem.item.id === item.id &&
          orderItem.price.unit === unit &&
          orderItem.price.currency === currency
        ) {
          // Found the matching order item, update the price value
          return {
            ...orderItem,
            price: {
              ...orderItem.price,
              value: numericValue,
            },
          };
        }
        return orderItem;
      }),
    }));
  },

  setItems: (items: Item[]) => {
    set((state) => ({
      ...state,
      items: items,
    }));
  },
  addOrderItem: (orderItem: OrderItem) =>
    set((state) => ({
      ...state,
      orderItems: [...state.orderItems, orderItem],
    })),

  removeOrderItem: (
    item: Item,
    unit?: Unit | unknown,
    currency?: Currency | unknown
  ) => {
    set((state) => ({
      ...state,
      orderItems: state.orderItems.filter((orderItem) => {
        // Check if both unit and currency are provided
        if (unit && currency) {
          return (
            orderItem.item.id !== item.id ||
            orderItem.price.unit !== unit ||
            orderItem.price.currency !== currency
          );
        }
        // If either unit or currency is not provided, remove all matching item ids
        return orderItem.item.id !== item.id;
      }),
    }));
  },

  clearOrderItems: () =>
    set(() => ({
      orderItems: [],
      calculateResult: {
        discount: 0,
        beforeDiscountTotal: 0,
        total: 0,
      },
      calculatedResult: {
        currency: '',
        discount: 0,
        beforeDiscountTotal: 0,
        total: 0,
      },
    })),
}));
