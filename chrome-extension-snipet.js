/**
 * notification api
 * "notifications"
 */

chrome.notifications.onButtonClicked.addListener(function () {});
chrome.notifications.create({
  type: "basic",
  iconUrl: "icon.png",
  title: "Time to Hydrate",
  message: "Everyday I'm Guzzlin'!",
  buttons: [{ title: "OK" }],
  priority: 0,
});

/**
 * browser action api
 */
chrome.browserAction.setBadgeText({ text: "ON" });
chrome.browserAction.onClicked.addListener(function(){}))//only work when no popup enabled

/**
 * Alarm api
 * "alarms"
 */

chrome.alarms.create("notify_date", {
    when: Date.now() + 60000,
});
chrome.alarms.onAlarm.addListener(function () {})
