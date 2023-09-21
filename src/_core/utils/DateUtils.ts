const decimalOfNumber = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
};

export const dateDiff = (timestamp, format = "full") => {
  const currentDate: any = new Date();
  const receivedDate: any = new Date(timestamp * 1000);
  let diff;

  if (receivedDate <= currentDate) {
    diff = new Date(currentDate - receivedDate);
  } else {
    diff = new Date(0);
  }

  const diffInYears = diff.getUTCFullYear() - 1970;
  const diffInMonth = diff.getUTCMonth();
  const diffInDays = diff.getUTCDate() - 1;
  const diffInHours = diff.getUTCHours();
  const diffInMinutes = diff.getUTCMinutes();

  let result;
  const isShort = format === "short";

  if (diffInYears) {
    const numerical = isShort ? "г." : decimalOfNumber(diffInYears, ["год", "года", "лет"]);
    result = `${diffInYears} ${numerical} назад`;
  } else if (diffInMonth) {
    const numerical = isShort ? "мес." : decimalOfNumber(diffInMonth, ["месяц", "месяца", "месяцев"]);
    result = `${diffInMonth} ${numerical} назад`;
  } else if (diffInDays) {
    const numerical = isShort ? "д." : decimalOfNumber(diffInDays, ["день", "дня", "дней"]);
    result = `${diffInDays} ${numerical} назад`;
  } else if (diffInHours) {
    const numerical = isShort ? "ч." : decimalOfNumber(diffInHours, ["час", "часа", "часов"]);
    result = `${diffInHours} ${numerical} назад`;
  } else if (diffInMinutes) {
    const numerical = isShort ? "мин." : decimalOfNumber(diffInMinutes, ["минута", "минуты", "минут"]);
    result = `${diffInMinutes} ${numerical} назад`;
  } else {
    result = "сейчас";
  }

  return result;
};
