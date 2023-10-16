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

export function removeDuplicationFromArray<T>(array: T[]) {
  return array.filter((value, index, self) => self.indexOf(value) === index);
}

// export function groupBy<T>(xs: T[], key: string) {
//   return xs.reduce((rv: { [key: string]: T[] }, x: T) => {
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// }
