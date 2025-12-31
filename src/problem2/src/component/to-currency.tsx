import { memo } from "react";
import CurrencyFlag from "react-currency-flags";
import { currencies } from "../currency/data";

function ToCurrency({
  toCurrency,
  formattedToAmount,
  setToCurrency,
}: {
  toCurrency: string;
  formattedToAmount: string;
  setToCurrency: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <div className="flex justify-between">
          {" "}
          <span>To</span> <CurrencyFlag currency={toCurrency} size="md" />
        </div>
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={formattedToAmount}
          readOnly
          className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 cursor-not-allowed"
          placeholder="0.00"
        />

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3"
        >
          {currencies.map((currency) => (
            <option
              key={currency.code}
              value={currency.code}
              title={currency.name}
            >
              {currency.code}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {currencies.find((c) => c.code === toCurrency)?.name}
      </p>
    </div>
  );
}

export default memo(ToCurrency);
