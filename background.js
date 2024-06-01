chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    // Get the activated tab
    const activatedTab = await chrome.tabs.get(activeInfo.tabId);
    console.log('Activated Tab URL:', activatedTab.url);

    // Check the URL of the activated tab
    if (activatedTab.url && activatedTab.url.includes('youtube.com/watch')) {
      chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        function: playVideo
      });
    }

    // Get all tabs
    const tabs = await chrome.tabs.query({});
    for (let tab of tabs) {
      if (tab.id !== activeInfo.tabId && tab.url.includes('youtube.com/watch')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: pauseVideo
        });
      }
    }
  } catch (error) {
    console.error('Error in onActivated:', error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/watch')) {
      console.log('Tab Updated URL:', tab.url);
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: playVideo
      });
    }
  } catch (error) {
    console.error('Error in onUpdated:', error);
  }
});

function playVideo() {
  console.log('Playing video');
  const video = document.querySelector('video');
  if (video) {
    video.play();
  }
}

function pauseVideo() {
  console.log('Pausing video');
  const video = document.querySelector('video');
  if (video) {
    video.pause();
  }
}
