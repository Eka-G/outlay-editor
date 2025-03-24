export default function formatNumber(value: number) {
  return Intl.NumberFormat('ru-RU').format(Number(value))
};
