import { useEffect, useState } from 'react';
import axios from 'axios';
import { ItemType } from '@/common/enums';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';

type Policy = {
  [ItemType.BEER]: {
    rules: string[];
  };
  [ItemType.BREAD]: {
    rules: string[];
  };
  [ItemType.VEGETABLE]: {
    rules: string[];
  };
};

const DiscountPolicy = () => {
  const [policies, setPolicies] = useState<Policy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getDiscountPolicy = async () => {
    try {
      const result = await axios.get('http://localhost:3000/discount/rules');
      setPolicies(result.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch policies');
      setLoading(false);
      console.error('Error fetching discount policies:', err);
    }
  };

  useEffect(() => {
    getDiscountPolicy();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex-1 mx-4">
      {policies ? (
        <div>
          {Object.entries(policies).map(([key, value]) => (
            <div key={key}>
              <Card className="my-4">
                <CardHeader>Discount: {key}</CardHeader>
                <CardContent>
                  {value.rules.map((rule, index) => (
                    <CardDescription key={index}>{rule}</CardDescription>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div>No discount policies available.</div>
      )}
    </div>
  );
};

export default DiscountPolicy;
