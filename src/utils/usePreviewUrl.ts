import { useContext } from 'react';

import { StoreContext } from './../StoreContext/StoreContext';
import { createPreviewUrl } from '../../utils';

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);

const baseUrl = playroomConfig.rewriteCopyPreviewUrl
  ? `${playroomConfig.rewriteCopyPreviewUrl}${window.location.search}${window.location.hash}`
  : window.location.href;

export default (theme: string) => {
  const [{ code }] = useContext(StoreContext);

  const isThemed = theme !== '__PLAYROOM__NO_THEME__';

  return createPreviewUrl({
    baseUrl: playroomConfig.rewriteCopyPreviewUrl
      ? baseUrl
      : baseUrl.split('index.html')[0],
    code,
    theme: isThemed ? theme : undefined,
    appendPreview: !playroomConfig.rewriteCopyPreviewUrl,
  });
};
