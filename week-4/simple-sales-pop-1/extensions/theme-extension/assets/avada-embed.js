(function() {
  const BASE_URL = 'https://statutes-llp-skirts-discussions.trycloudflare.com/scripttag';

  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.async = !0;
  scriptElement.src = BASE_URL + `/avada-sale-pop.min.js?v=${new Date().getTime()}`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);
})();
