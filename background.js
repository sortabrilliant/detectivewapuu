// Send message to current tab.
chrome.browserAction.onClicked.addListener( ( tab ) => {
    chrome.tabs.sendMessage(tab.id, {"message": "scan_blocks"});
} );

// Change icon color if blocks are detected.
chrome.runtime.onMessage.addListener( ( request, sender ) => {
    if ( request.message === "has_blocks" ) {
        chrome.browserAction.setIcon({
            path: "images/blue/32.png",
            tabId: sender.tab.id
        });
    }
} );
