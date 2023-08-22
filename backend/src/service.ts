export async function verifyEndpoint(endpoint: string): Promise<boolean> {
  try {
    const response = await fetch(endpoint);

    // Check if the response status code is in the range of successful responses
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    // An error occurred while making the request, so the endpoint is not valid
    return false;
  }
}

/// try/catch
export function tc <T>(tryFunc: () => T, catchFunc: (e: Error) => T) {
  let val: T;
  try {
    val = tryFunc();
  } catch (e) {
    val = catchFunc(e as Error);
  }
  return val;
}
