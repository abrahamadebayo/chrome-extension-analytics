import { AxiosError } from 'axios';

export interface ApiError {
  isAxiosError: boolean;
  message: string;
  status: number;
  type?: string;
  originalError: AxiosError;
}
