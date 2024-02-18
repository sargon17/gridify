const getUrl = async () => {
  let url;

  try {
    url = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        resolve(new URL(tabs[0].url));
      });
    });
  } catch (error) {
    console.log(error);
  }
  return url;
};

// gets a string to put after current url and returns it
const urlConcat = async (concat) => {
  const url = await getUrl();

  return url.hostname + "_" + concat;
};

export { getUrl, urlConcat };
