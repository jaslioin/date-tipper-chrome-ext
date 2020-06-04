const NOW = Date.now();
const CONFESSION_DATE = new Date(2018, 9, 27).getTime();
const ONE_MONTH = 2678400000; //31*24*60*60*1000
const ONE_DAY = ONE_MONTH / 31;
const ONE_YEAR = ONE_MONTH * 12;
const UNIQUE_NUM = {
  520: "我愛你",
  521: "我愛你",
  1314: "一生一世",
};
const isHundredDividable = (num) => {
  return num % 100 === 0;
};
const isUnique = (num) => {
  return UNIQUE_NUM[num];
};
const getTimeLapse = (SINCE, NOW, type = "month") => {
  let unit = ONE_MONTH;
  if (type === "day") {
    unit = ONE_DAY;
  } else if (type === "year") {
    unit = ONE_YEAR;
  }
  const result = Math.ceil((NOW - SINCE) / unit);
  const packet = {
    result,
    type,
    isSpecial: false,
    msg: "",
  };
  if (isUnique(result)) {
    packet["isSpecial"] = true;
    packet["msg"] = isUnique(result);
  } else if (isHundredDividable(result)) {
    packet["isSpecial"] = true;
    packet["msg"] = `Hundred ${type}-versary!`;
  }
  //test
  const actual = (NOW - SINCE) / unit;
  console.log(actual);
  const month = Math.floor(actual);
  console.log(month);
  console.log(actual - month);
  const days = ((actual - month) * unit) / ONE_DAY;
  console.log(days);
  return packet;
};

getTimeLapse(CONFESSION_DATE, NOW);
