const lzString = require('lz-string');

const createUrl = ({ baseUrl, code, themes, widths }) => {
  let path = '';

  if (code || themes || widths) {
    const data = JSON.stringify({
      ...(code ? { code } : {}),
      ...(themes ? { themes } : {}),
      ...(widths ? { widths } : {}),
    });

    const compressedData = lzString.compressToEncodedURIComponent(data);
    path = `#?code=${compressedData}`;
  }

  if (baseUrl) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');

    return `${trimmedBaseUrl}/${path}`;
  }

  return path;
};

const createPreviewUrl = ({ baseUrl, code, theme, appendPreview = true }) => {
  let path = '';

  if (code || theme) {
    const data = JSON.stringify({
      ...(code ? { code } : {}),
      ...(theme ? { theme } : {}),
    });

    const compressedData = lzString.compressToEncodedURIComponent(data);
    path = `${appendPreview ? '/preview' : ''}?code=${compressedData}`;
  }

  if (baseUrl) {
    if (appendPreview) {
      const trimmedBaseUrl = baseUrl.replace(/\/$/, '');
      return `${trimmedBaseUrl}${path}`;
    }
    return `${baseUrl}${path}`;
  }

  return path;
};

module.exports = {
  createUrl,
  createPreviewUrl,
};
