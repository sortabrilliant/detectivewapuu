chrome.browserAction.onClicked.addListener( ( tab ) => {

    // Send message to current tab.
    chrome.tabs.sendMessage(tab.id, {"message": "scan_blocks"});
} );
