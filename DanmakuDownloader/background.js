
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color : '#ba10f7'}, function() {
      console.log("The color is green.");
    });
	chrome.storage.sync.set({color2: '#faf200'}, function() {
      console.log("The color is whatever.");
    });
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{conditions: [
		new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'www.bilibili.com'},
		}),
		new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'comment.bilibili.com'},
		})
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});