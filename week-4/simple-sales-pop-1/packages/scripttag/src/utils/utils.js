// string => object . "bottom-left" =>  { bottom : 0,  left: 0, }
export function stringToObjectStyle({position, first = 0, second = 0}) {
  const keys = position.split('-'); // ["bottom", "left"]

  const values = [first, second];

  return keys.reduce((acc, key, index) => {
    acc[key] = `${values[index] || 0}px`;
    return acc;
  }, {});
}

export function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
