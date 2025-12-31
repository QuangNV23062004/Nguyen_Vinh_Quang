import { memo } from "react";

function ExchangeRateInfo({
  fromCurrency,
  toCurrency,
  exchangeRate,
  lastUpdated,
}: {
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  lastUpdated: Date | null;
}) {
  return (
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <p className="text-sm text-gray-600">
        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {lastUpdated && <>Last updated: {lastUpdated.toLocaleString()}</>}
      </p>
    </div>
  );
}

export default memo(ExchangeRateInfo);
