export const arrayEquals = (first, second) => {
  let length = first.length;
  if (length !== second.length) return false;
  while (length--) {
    if (first[length] !== second[length]) return false;
  }
  return true;
};
