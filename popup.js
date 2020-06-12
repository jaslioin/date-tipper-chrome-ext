// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";
const NOW_TS = Date.now();
const NOW_DATE_OBJ = new Date(NOW_TS);
const NOW = {
  year: NOW_DATE_OBJ.getFullYear(),
  month: NOW_DATE_OBJ.getMonth() + 1,
  date: NOW_DATE_OBJ.getDate(),
};
const SINCE_DATE_OBJ = new Date(2018, 9, 27);
const SINCE_TS = SINCE_DATE_OBJ.getTime();
const SINCE = {
  year: SINCE_DATE_OBJ.getFullYear(),
  month: SINCE_DATE_OBJ.getMonth() + 1,
  date: SINCE_DATE_OBJ.getDate(),
};
const ONE_MONTH = 2678400000; //31*24*60*60*1000
const ONE_DAY = ONE_MONTH / 31;
const ONE_YEAR = ONE_MONTH * 12;
function isHundredDividable(num) {
  return num != 0 && num % 100 === 0;
}
function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
class Lapse {
  /**
   * All about special days during 2 dates, answers these few questions:
   * - how many days have passed?
   * - how many months have passed?
   * - how special a date is for you or your partner
   * -
   * @param {object} since { year:,month:.date }
   * @param {object} now { year:,month:.date }
   */
  constructor(since, now) {
    let stepYear = 0,
      stepMonth = 0;
    this.since = since;
    this.now = now;
    this.UNIQUE_NUM = {
      520: "I LOVE U",
      521: "I LOVE U",
      1314: "Together forever",
      27: "CONFESSION DAY",
    };
    this.monthDaysMapping = {
      1: 31,
      2: 28, //add one when leap year
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
    if (
      Date.parse(since.year, since.month - 1, since.date) >
      Date.parse(now.year, now.month - 1, now.date)
    ) {
      throw new Error("Invalid date pair");
    }
    if (
      typeof since.year != "number" ||
      typeof since.month != "number" ||
      typeof since.date != "number" ||
      typeof since.year != "number" ||
      typeof since.month != "number" ||
      typeof since.date != "number"
    ) {
      throw new Error("Input must be object of numbers");
    }
    if (now.date == since.date) {
      this.days = 0;
    } else if (now.date < since.date) {
      this.days = now.date + (this.monthDaysMapping[since.month] - since.date);
      stepMonth++;
      if (this.days >= this.monthDaysMapping[since.month]) {
        stepMonth--;
        this.days = this.days - this.monthDaysMapping[since.month];
      }
    } else {
      this.days =
        now.date +
        (this.monthDaysMapping[since.month] - since.date) +
        1 -
        this.monthDaysMapping[since.month];
    }
    if (now.month - stepMonth - since.month > 0) {
      this.months = now.month - stepMonth - since.month;
    } else if (now.month - stepMonth - since.month < 0) {
      this.months = 12 + (now.month - stepMonth - since.month);
      stepYear++;
    } else {
      this.months = 0;
    }
    this.years = now.year - since.year - stepYear;
  }

  async calculateFutureSpecialDates(year, month, date) {
    return new Promise((res, rej) => {
      const result = [];
      for (let y = this.since.year; y <= year; y++) {
        if (y == this.since.year) {
          for (let m = this.since.month; m <= 12; m++) {
            for (
              let d = this.since.date + 1;
              d <= this.monthDaysMapping[m];
              d++
            ) {
              const memorable = new Lapse(this.since, {
                year: y,
                month: m,
                date: d,
              }).getMemorable();
              if (memorable.length) {
                result.push({ y, m, d, memorable });
              }
            }
          }
        } else if (y == year) {
          for (let m = 1; m <= month; m++) {
            for (let d = 1; d <= this.monthDaysMapping[m]; d++) {
              const memorable = new Lapse(this.since, {
                year: y,
                month: m,
                date: d,
              }).getMemorable();
              if (memorable.length) {
                result.push({ y, m, d, memorable });
              }
            }
          }
        } else {
          for (let m = 1; m <= 12; m++) {
            for (let d = 1; d <= this.monthDaysMapping[m]; d++) {
              const memorable = new Lapse(this.since, {
                year: y,
                month: m,
                date: d,
              }).getMemorable();
              if (memorable.length) {
                result.push([y, m, d, memorable]);
              }
            }
          }
        }
      }
      res(result);
    });
  }

  setUniqNum(number, meaning) {
    this.UNIQUE_NUM[number] = meaning;
  }
  getAllLapse() {
    return {
      years: this.years,
      months: this.months,
      days: this.days,
    };
  }
  getYearLapse() {
    // inaccurate
    return {
      num: this.years + this.months / 12 + this.days / 365,
    };
  }
  getMonthLapse() {
    return {
      months: this.years * 12 + this.months,
      days: this.days,
    };
  }
  getDayLapse() {
    const date = this.since.date;
    const month = this.since.month;
    const year = this.since.year;
    const thisDate = this.now.date;
    const thisMonth = this.now.month;
    const thisYear = this.now.year;

    // start year
    let daysPassedThatYear = 0;
    for (let m = month; m <= 12; m++) {
      if (m === 2 && isLeapYear(year)) {
        daysPassedThatYear++;
      }
      if (m === month) {
        daysPassedThatYear += this.monthDaysMapping[m] - date + 1; //inclusive start
        continue;
      }
      daysPassedThatYear += this.monthDaysMapping[m];
    }
    // middle years
    let fullYearDaysPassed = 0;

    for (let i = year + 1; i < thisYear; i++) {
      if (isLeapYear(i)) {
        fullYearDaysPassed += 366;
        continue;
      }
      fullYearDaysPassed += 365;
    }
    // this year
    let daysPassedCurrentYear = 0;
    for (let m = 1; m < thisMonth; m++) {
      if (m === 2 && isLeapYear(thisYear)) {
        daysPassedCurrentYear++;
      }
      daysPassedCurrentYear += this.monthDaysMapping[m];
    }
    daysPassedCurrentYear += thisDate; //inclusive end

    //days passed in total
    const daysPassedInTotal =
      fullYearDaysPassed + daysPassedThatYear + daysPassedCurrentYear;

    return daysPassedInTotal;
  }
  getMemorable(
    totalMonths = this.getMonthLapse().months,
    totalDays = this.getDayLapse(),
    totalYears = this.years
  ) {
    const result = [];
    if (isHundredDividable(totalMonths)) {
      result.push(`${totalMonths} months!`);
    }
    if (totalYears > 0 && isHundredDividable(totalYears)) {
      result.push(`${totalYears} years!`);
    }
    if (isHundredDividable(totalDays)) {
      result.push(`${totalDays} days!`);
    }
    if (this.isUnique(totalMonths)) {
      result.push(`${totalMonths}( ${this.UNIQUE_NUM[totalMonths]} ) months!`);
    }
    if (this.isUnique(totalDays)) {
      result.push(`${totalDays}( ${this.UNIQUE_NUM[totalDays]} ) days!`);
    }
    if (this.isUnique(totalYears)) {
      result.push(`${totalYears}( ${this.UNIQUE_NUM[totalYears]} ) years!`);
    }
    if (this.months === 0 && this.days === 0) {
      result.push(`${this.years} year-anniversary!`);
    }
    if (this.isUniqueMD()) {
      result.push(this.isUniqueMD());
    }
    if (this.isUniqueYMD()) {
      result.push(this.isUniqueYMD());
    }
    return result;
  }

  isUnique = (num) => {
    return this.UNIQUE_NUM[num];
  };
  isUniqueYMD = (
    years = this.years,
    months = this.months,
    days = this.days
  ) => {
    return this.UNIQUE_NUM[Number(years + "" + months + "" + days)];
  };
  isUniqueMD = (
    months = this.getMonthLapse().months,
    days = this.getMonthLapse().days
  ) => {
    return this.UNIQUE_NUM[Number(months + "" + days)];
  };
}

const DateTipper = (function () {
  function predict(e) {
    const predictYear = document.getElementById("predict-year").valueAsNumber;
    const predictMonth = document.getElementById("predict-month").valueAsNumber;
    const predictDate = document.getElementById("predict-date").valueAsNumber;
    if (predictYear > 0 && predictMonth > 0 && predictDate > 0) {
      update(predictYear, predictMonth, predictDate);
    }
  }

  function update(predictYear, predictMonth, predictDate) {
    const timeLapse = new Lapse(SINCE, {
      year: predictYear,
      month: predictMonth,
      date: predictDate,
    });
    window.timeLapse = timeLapse;
    console.log(timeLapse);

    const dayDiv = document.getElementById(`result-day`);
    const monthDiv = document.getElementById(`result-month`);
    const yearDiv = document.getElementById(`result-year`);
    const totalDays = timeLapse.getDayLapse();
    const months = timeLapse.getMonthLapse();
    const years = timeLapse.getAllLapse();
    dayDiv.innerText = totalDays + " days";
    monthDiv.innerText = `${months.months} months ${months.days} days`;
    yearDiv.innerText = `${years.years} years ${years.months} months ${years.days} days`;

    const msgDiv = document.getElementById("msg");
    const specialties = timeLapse.getMemorable();
    msgDiv.innerText = "";
    for (let i of specialties) {
      const specialtyDiv = document.createElement("div");
      specialtyDiv.innerText = i;
      msgDiv.appendChild(specialtyDiv);
    }
  }

  function init() {
    document.addEventListener("DOMContentLoaded", function () {
      update(NOW.year, NOW.month, NOW.date);
      const predictYear = document.getElementById("predict-year");
      const predictMonth = document.getElementById("predict-month");
      const predictDate = document.getElementById("predict-date");
      predictYear.oninput = predict;
      predictDate.oninput = predict;
      predictMonth.oninput = predict;
    });
  }
  return {
    predict,
    update,
    init,
  };
})();
DateTipper.init();
