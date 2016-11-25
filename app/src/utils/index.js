export function cleanHeroKey (championKey) {
  return ('' + championKey).replace(/[-\+'`´\s]+/g, '').toLowerCase();
}

export function prepareAds (ads) {
  ads.forEach(ad => {
    if (ad) {
      const code = `googletag.cmd.push(function() { googletag.display('${ad}'); });`
      eval(code);
    }
  });
}
