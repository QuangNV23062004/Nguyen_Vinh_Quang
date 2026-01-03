import axios from "axios";
export type IExchangeRateResponse = {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
};

export class ExchangeRateService {
  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<IExchangeRateResponse> {
    // Simulate API delay with 5 second timeout
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${
        import.meta.env.VITE_EXCHANGE_RATE_API_KEY
      }/pair/${fromCurrency}/${toCurrency}`
    );

    return response.data;
  }
}
