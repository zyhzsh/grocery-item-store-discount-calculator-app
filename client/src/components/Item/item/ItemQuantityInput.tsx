import React from 'react';
import { Input } from '@/components/ui/input';

type Props = {
  handleQuantityChange: (quantity: number) => void;
  defaultValue: number;
};

const ItemQuantityInput: React.FC<Props> = ({
  handleQuantityChange,
  defaultValue,
}) => {
  const enforceMinMax = (value: number) => {
    if (isNaN(value) || value < 0.01) {
      return 0.01;
    } else if (value > 5000) {
      return 5000;
    }
    return value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    // Remove non-numeric characters except for dots
    inputValue = inputValue.replace(/[^0-9.]/g, '');
    // Remove multiple dots and ensure only one decimal point remains
    inputValue = inputValue.replace(/(\..*)\./g, '$1');
    // Update the input field value
    e.target.value = inputValue;
    // Call the enforceMinMax function with the updated value
    handleQuantityChange(enforceMinMax(parseFloat(inputValue)));
  };

  return (
    <div>
      <Input
        required
        type="text" // Change the type to text to prevent HTML5 validation
        onChange={handleInputChange}
        defaultValue={defaultValue.toString()} // Convert defaultValue to string
      />
    </div>
  );
};

export default ItemQuantityInput;
