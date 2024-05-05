import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

type Props = {
  handleNameChange: (name: string) => void;
  defaultValue: string;
};

const ItemNameInput: React.FC<Props> = ({ handleNameChange, defaultValue }) => {
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const isValidInput = name.trim() !== ''; // Check if the input is not empty
    setIsValid(isValidInput);
    if (isValidInput) {
      handleNameChange(name);
    }
  };

  return (
    <div>
      <Input
        required // This will prevent submission if the input is empty
        type="text"
        defaultValue={defaultValue}
        placeholder="Your product name"
        onChange={handleChange}
        style={{ borderColor: isValid ? '' : 'red' }} // Highlight the input border if it's invalid
      />
      {!isValid && (
        <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          Please enter a product name.
        </p>
      )}
    </div>
  );
};

export default ItemNameInput;
