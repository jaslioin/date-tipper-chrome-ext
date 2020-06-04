// chrome.alarms.create("notify_date", {
//   when: Date.now() + 60000,
// });
// chrome.alarms.onAlarm.addListener(function () {
//   chrome.notifications.create({
//     type: "basic",
//     iconUrl: "icon.png",
//     title: "Time to Hydrate",
//     message: "Everyday I'm Guzzlin'!",
//     buttons: [{ title: "Notify again in 1 minute" }],
//     priority: 0,
//   });
//   chrome.notifications.onButtonClicked.addListener(function () {
//     chrome.alarms.create("notify_date", {
//       when: Date.now() + 60000,
//     });
//   });
// });
