const URL_SERVER = 'http://localhost:5000';

(async function() {
  const BASE_URL = 'http://localhost:5000/scripttag';
  const {settings} = await getNotificationsAndSettingsShop();
  const {allShow, includeUrls, excludeUrls} = settings;
  let canShow = false;
  if (allShow === 'specific') {
    const currentPath = window.location.pathname;
    if (excludeUrls === '') {
      canShow = isUrlMatched(includeUrls, currentPath);
    } else {
      canShow = !isUrlMatched(excludeUrls, currentPath);
    }
  } else {
    // allShow = allPage
    canShow = true;
  }
  if (canShow) {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = !0;
    scriptElement.src = BASE_URL + `/avada-sale-pop.min.js?v=${new Date().getTime()}`;
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(scriptElement, firstScript);
  }
})();

function isUrlMatched(urlPatterns = '', currentPath = '') {
  if (!urlPatterns) return false;
  return urlPatterns.split(',').some(p => currentPath === p);
}

function getNotificationsAndSettingsShop() {
  return getApiData();
}

async function getApiData() {
  const shopifyDomain = window.Shopify.shop;
  const {notifications, settings} = await makeRequest(`${URL_SERVER}/clientApi/${shopifyDomain}`);

  return {notifications, settings};
}

function makeRequest(url, method, data = null, options = {}) {
  // Create the XHR request
  const request = new XMLHttpRequest();

  // Return it as a Promise
  return new Promise(function(resolve, reject) {
    // Setup our listener to process compeleted requests
    request.onreadystatechange = function() {
      // Only run if the request is complete
      if (request.readyState !== 4) return;

      // Process the response
      resolve(JSON.parse(request.responseText));
    };

    // Setup our HTTP request
    request.open(method || 'GET', url, true);

    // Send the request
    if (data) {
      if (options.contentType) {
        const contentType = options.contentType || 'application/json;charset=UTF-8';
        request.setRequestHeader('Content-Type', contentType);
        request.send(JSON.stringify(data));
      }

      request.send(data);
    } else {
      request.send(data);
    }
  });
}
