const updateNestedObjectParser = (obj) => {
  const final = {};
  console.log(`[1] ---------`);
  Object.keys(obj).forEach((k) => {
    console.log(`[3]`, k);
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        console.log(`[4]`, a);
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log(`[2]`, final);
  return final;
};

const obj = {
  c: 1,
  a: {
    b: {
      d: 2,
    },
    e: 4,
  },
};

console.log(updateNestedObjectParser(obj));
