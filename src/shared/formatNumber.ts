const formatNumber = (value: number) => {
  return Intl.NumberFormat('ru-RU').format(Number(value))
};

export default formatNumber;
