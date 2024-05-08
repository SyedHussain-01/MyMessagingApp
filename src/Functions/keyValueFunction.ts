const keyvaluefunction = () => {
  const obj = {
    a: 'hussain',
    b: true,
    c: 3,
    d: () => null,
    e: {
      n: 1,
      o: 2,
    },
    f: [1, 2],
  };
  return Object.entries(obj).filter(key => {
    return (
      typeof key[1] == 'string' ||
      typeof key[1] == 'number' ||
      typeof key[1] == 'boolean'
    );
  });
};

console.log(keyvaluefunction());
