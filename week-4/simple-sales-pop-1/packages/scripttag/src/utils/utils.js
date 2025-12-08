// string => object . "bottom-left" =>  { bottom : 0,  left: 0, }
export function stringToObjectStyle(position) {
  const objStyle = position.split('-').reduce((acc, key) => {
    acc[key] = '15px';
    return acc;
  }, {});
  return objStyle;
}
export function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
