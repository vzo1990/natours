module.exports = (obj, ...allowedFields) => {
  const filteredObj = {};
  allowedFields.forEach((el) => {
    if (obj[el]) filteredObj[el] = obj[el];
  });
  return filteredObj;
};
