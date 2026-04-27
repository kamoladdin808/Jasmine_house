/**
 * Режим «чисто на показ»: без бэка, без API, всё в браузере.
 * Чтобы позже подключить сервер: поставьте JB_PRESENTATION_MODE = false
 * и настройте JB_AUTH_STUB / URL API в jb-auth.
 */
(function (global) {
  'use strict';
  global.JB_PRESENTATION_MODE = false;
  global.JB_AUTH_STUB = false;
  global.JB_BACKEND_LIVE = true;
  global.JB_API_BASE = '';
  global.JB_GEO_REVERSE = false;
  if (!global.JB_API_BASE && global.location && global.location.origin && global.location.origin !== 'null') {
    global.JB_API_BASE = global.location.origin;
  }
  try {
    Object.defineProperty(global, 'JB_API_BASE', {
      value: global.JB_API_BASE,
      writable: false,
      configurable: false,
    });
  } catch (e) {}
})(typeof window !== 'undefined' ? window : this);
