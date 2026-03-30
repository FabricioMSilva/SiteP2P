const { parseM3U } = require('./lib/m3uParser');
const fetch = require('node-fetch');

(async () => {
  const url = 'http://stdsdpvat.top/get.php?username=930661117xtvs&password=a653Z1466E&type=m3u_plus&output=hls';
  try {
    const res = await fetch(url);
    console.log('status', res.status, res.statusText);
    const text = await res.text();
    console.log('sample', text.slice(0, 300));
    const parsed = parseM3U(text);
    console.log('entries', parsed.length);
    console.log(parsed.slice(0, 3));
  } catch (e) {
    console.error('err', e.message || e);
  }
})();