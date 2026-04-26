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
})(typeof window !== 'undefined' ? window : this);
