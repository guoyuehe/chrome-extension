chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, { type: "startReadingTweets" });
    console.log("clicked")
})
