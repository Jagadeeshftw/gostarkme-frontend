'use client';

import { useState, useEffect } from 'react';

export default function PriceBox() {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=starknet&vs_currencies=usd'
        );
        const data = await response.json();
        setPrice(data.starknet?.usd || 0);
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm">
      STRK: ${price.toFixed(6)}
    </div>
  );
}