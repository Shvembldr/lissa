export default index => (a, b) => {
  if (a[index] < b[index]) return -1;
  if (a[index] > b[index]) return 1;
  return 0;
};
