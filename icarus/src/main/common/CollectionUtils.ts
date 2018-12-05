export function groupBy<V>(arr: V[], f: (value: V) => string): { [key: string]: V[] } {
  const result: { [key: string]: V[] } = {};
  arr.forEach(v => {
    const index = f(v);
    const bucket = result[index] || (result[index] = []);
    bucket.push(v);
  });
  return result;
}

export function mapValues<I, O>(m: { [key: string]: I }, f: (key: string, value: I) => O): { [key: string]: O } {
  const result: { [key: string]: O } = {};

  for (let key in m) {
    result[key] = f(key, m[key]);
  };

  return result;
}
