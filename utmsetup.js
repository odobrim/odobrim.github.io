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

/// https://landings.odobrim.ru/tele2/predlosheniya?utm_source={utm_source}&utm_medium={utm_medium}&utm_campaign={utm_campaign}&utm_content={utm_content}&utm_term={utm_content}&transaction_id={transaction_id}
// https://landings.odobrim.ru/tele2/predlosheniya
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
      key: 'utm_medium',
      value: getRefQueryParam('utm_medium'),
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

const readyFunction = () => {
  const dataValuesList = getDataFromAddressBar();
  const linksList = document.querySelectorAll('a');

  linksList.forEach(elem => {
    if (elem.href.indexOf('#popup', 0) == -1) {
      const newLink = updateLinkWithParams(elem.href, dataValuesList);
      elem.href = newLink;
    };
  });
  
  const divsList = document.querySelectorAll('div');
  divsList.forEach(div => {
    const successUrlData = div.getAttribute('data-field-formmsgurl-value');
    if (!successUrlData) return;
    const newLink = updateLinkWithParams(successUrlData, dataValuesList);
    div.setAttribute('data-field-formmsgurl-value', newLink);
  });
  
  const formsList = document.querySelectorAll('form');
  formsList.forEach(form => {
    const successUrlData = form.getAttribute('data-success-url');
    if (!successUrlData) return;
    const newLink = updateLinkWithParams(successUrlData, dataValuesList);
    form.setAttribute('data-success-url', newLink);
  });
}

document.addEventListener('DOMContentLoaded', readyFunction);

