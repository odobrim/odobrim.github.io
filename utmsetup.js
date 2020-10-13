function getRefQueryParam(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function updateLinkWithParams(link, dataList) {
  return !link
    ? link
    : dataList.reduce((result, current) => {
      const { key, value } = current;
      const regexp = new RegExp(`{${key}}`, 'g');
      return result.replace(regexp, value);
    }, link);
}

getDataFromAddressBar = () => (
  [
    {
      key: 'utm_source',
      value: getRefQueryParam('utm_source'),
    },
    {
      key: 'utm_campaign',
      value: getRefQueryParam('utm_campaign'),
    },
    {
      key: 'transaction_id',
      value: getRefQueryParam('transaction_id'),
    },
    {
      key: 'utm_content',
      value: getRefQueryParam('utm_content'),
    },
    {
      key: 'utm_term',
      value: getRefQueryParam('utm_term'),
    }
  ]
)

window.onload = function () {
  const dataValuesList = getDataFromAddressBar();
  const linksList = document.querySelectorAll('a');

  linksList.forEach(elem => {
    if (elem.href.indexOf('#popup', 0) == -1) {
      const newLink = updateLinkWithParams(elem.href, dataValuesList);
      elem.href = newLink;
    };
  })
}

