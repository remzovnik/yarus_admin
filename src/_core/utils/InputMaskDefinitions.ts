export const phoneMask = {
  mask: "+{7} (000) 000-00-00",
};

export const dateMask = {
  mask: Date,
  pattern: "d{.}`m{.}`Y",
  format(date) {
    if (!!date.getDate) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      const year = date.getFullYear();

      if (day < 10) day = "0" + day;
      if (month < 10) month = "0" + month;

      return [day, month, year].join(".");
    } else {
      return date;
    }
  },
  parse(str) {
    const yearMonthDay = str.split(".");
    const date = new Date(yearMonthDay[2], yearMonthDay[1] - 1, yearMonthDay[0]);
    return date;
  },
  lazy: false,
};
