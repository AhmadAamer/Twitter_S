import { ResponseType } from './objectType';

export function createResponse<T>(
  data: T,
  message: string = '',
  success: boolean = true,
): ResponseType<T> {
  return {
    success,
    message,
    data,
  };
}
