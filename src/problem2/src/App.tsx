import { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { z, ZodError } from "zod";
import Header from "./component/header";
import FromCurrency from "./component/from-currency";
import SwapButton from "./component/swap-button";
import ToCurrency from "./component/to-currency";
import ExchangeRateInfo from "./component/exchange-rate-info";
import ConvertButton from "./component/convert-button";
import { ExchangeRateService } from "./service/exchange-rate.service";

const currencySchema = z.object({
  fromAmount: z
    .number()
    .positive("Amount must be positive")
    .max(10000000000000000, "Amount too large")
    .min(0.01, "Amount must be at least 0.01"),
  fromCurrency: z.string().length(3, "Invalid currency code"),
  toCurrency: z.string().length(3, "Invalid currency code"),
});

function App() {
  const exchangeRateService = new ExchangeRateService();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [exchangeRate, setExchangeRate] = useState<number>(0.8508);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConverted, setIsConverted] = useState<boolean>(true);

  // Format number with thousand separators
  const formatNumber = useCallback((num: number): string => {
    if (num === 0) return "";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  }, []);

  // Parse formatted string back to number
  const parseFormattedNumber = useCallback((value: string): number => {
    const cleaned = value.replace(/[^\d.]/g, "");
    const amount = parseFloat(cleaned);
    return isNaN(amount) ? 0 : amount;
  }, []);

  const handleSetFromAmount = useCallback(
    (value: string) => {
      try {
        const amount = parseFormattedNumber(value);
        setFromAmount(amount);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Invalid amount entered"
        );
      }
    },
    [parseFormattedNumber]
  );

  const handleConvert = useCallback(async () => {
    try {
      currencySchema.parse({
        fromAmount,
        fromCurrency,
        toCurrency,
      });

      setIsLoading(true);
      const responseData = await exchangeRateService.getExchangeRate(
        fromCurrency,
        toCurrency
      );
      setExchangeRate(responseData?.conversion_rate);
      setLastUpdated(new Date(responseData?.time_last_update_utc));
      setToAmount(
        fromAmount
          ? parseFloat((fromAmount * responseData?.conversion_rate).toFixed(2))
          : 0
      );
      setIsConverted(true);
      toast.success("Exchanged successfully");
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join(", ");
        toast.warning(errorMessage);
      } else
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch exchange rate"
        );

      return;
    } finally {
      setIsLoading(false);
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setExchangeRate(1 / exchangeRate);
  }, [toCurrency, fromCurrency, toAmount, fromAmount, exchangeRate]);

  // Memoize formatted values to prevent unnecessary recalculations
  const formattedFromAmount = useMemo(
    () => formatNumber(fromAmount),
    [fromAmount, formatNumber]
  );
  const formattedToAmount = useMemo(
    () => formatNumber(toAmount),
    [toAmount, formatNumber]
  );

  useEffect(() => {
    if (isConverted) {
      setIsConverted(false);
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Header />

          {/* From Currency */}
          <FromCurrency
            fromCurrency={fromCurrency}
            formattedFromAmount={formattedFromAmount}
            handleSetFromAmount={handleSetFromAmount}
            setFromCurrency={setFromCurrency}
          />

          {/* Swap Button */}
          <SwapButton onSwap={swapCurrencies} />

          {/* To Currency */}
          <ToCurrency
            toCurrency={toCurrency}
            formattedToAmount={formattedToAmount}
            setToCurrency={setToCurrency}
          />

          {/* Exchange Rate Info */}
          {isConverted && (
            <ExchangeRateInfo
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              exchangeRate={exchangeRate}
              lastUpdated={lastUpdated}
            />
          )}

          {/* Convert Button */}
          <ConvertButton handleConvert={handleConvert} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
