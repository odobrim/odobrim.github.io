
(function (a) {
    var b = a.createElement("script");
    b.async = 1;
    b.src = "//code.acstat.com/";
    a = a.getElementsByTagName("script")[0]; a.parentNode.insertBefore(b, a)
})(document);

const getTrackId = () => {
    let result = '';
    const length = 32;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';

    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

const getRefQueryParam = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

const DAYS_TO_EXPIRATION = 30;
const REMOVE_COOKIE_DAYS = -2;

const advcake_trackid = getTrackId();
const advcake_url = location.href;
const utm_source = getRefQueryParam('utm_source');

const setCookies = (days) => {
    const date = new Date(Date.now() + (86400e3 * days));
    document.cookie = `advcake_url="${advcake_url}";expires=${date};secure;domain=.odobrim.ru;path=/`;
    document.cookie = `advcake_trackid=${advcake_trackid};expires=${date};secure;domain=.odobrim.ru;path=/`;
}

if (utm_source === 'advcake') {
    setCookies(DAYS_TO_EXPIRATION);
} else if (utm_source && utm_source !== 'advcake') {
    setCookies(REMOVE_COOKIE_DAYS);
}