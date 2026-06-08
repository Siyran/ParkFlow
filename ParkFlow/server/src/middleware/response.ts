export function success(data: unknown, message = 'OK') {
  return {
    success: true,
    data,
    message,
    error: null,
  };
}
