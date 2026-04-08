/**
 * Режим «чисто на показ»: без бэка, без API, всё в браузере.
 * Чтобы позже подключить сервер: поставьте JB_PRESENTATION_MODE = false
 * и настройте JB_AUTH_STUB / URL API в jb-auth.
 */
(function (global) {
  'use strict';
  global.JB_PRESENTATION_MODE = true;
  global.JB_AUTH_STUB = true;
  global.JB_BACKEND_LIVE = false;

  if (global.JB_PRESENTATION_MODE) {
    try {
      localStorage.setItem('jh_auth_stub', '1');
      localStorage.removeItem('jh_api_base');
    } catch (e) {}
  }
})(typeof window !== 'undefined' ? window : this);
