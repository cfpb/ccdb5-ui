// eslint-disable-next-line unicorn/consistent-boolean-name -- public util name
export const arrayEquals = (
  first: readonly unknown[],
  second: readonly unknown[],
): boolean => {
  let length = first.length;
  if (length !== second.length) return false;
  while (length--) {
    if (first[length] !== second[length]) return false;
  }
  return true;
};
