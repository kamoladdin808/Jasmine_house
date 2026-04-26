/**
 * Клиент под JWT бэка Jasmin: claims user_id, roles[], exp.
 * Режим «только показ»: jb-config.js задаёт JB_PRESENTATION_MODE — тогда всегда заглушка, без API.
 * Иначе: заглушка по JB_AUTH_STUB / localStorage или пустой API base.
 */
(function (global) {
  'use strict';

  var TOKEN_KEY = 'jh_jwt';
  var API_KEY = 'jh_api_base';
  var STUB_LS_KEY = 'jh_auth_stub';

  /** Роли, при которых показываем ссылку «персонал» (подстройте под свой бэк). */
  var STAFF_ROLES = ['admin', 'manager', 'kitchen', 'staff', 'courier'];

  function getApiBase() {
    var fromLs = '';
    try {
      fromLs = localStorage.getItem(API_KEY) || '';
    } catch (e) { }
    var b = (global.JB_API_BASE || fromLs || '').replace(/\/$/, '');
    return b;
  }

  function setApiBase(url) {
    try {
      if (url) localStorage.setItem(API_KEY, String(url).replace(/\/$/, ''));
      else localStorage.removeItem(API_KEY);
    } catch (e) { }
  }

  function getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setToken(token) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) { }
  }


  function parseJwtPayload(token) {
    if (!token || typeof token !== 'string') return null;
    var parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      var s = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (s.length % 4) s += '=';
      var json = decodeURIComponent(
        Array.prototype.map
          .call(atob(s), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  function normalizeRoles(payload) {
    if (!payload) return [];
    var r = payload.roles;
    if (typeof r === 'string') {
      return r
        .split(',')
        .map(function (x) {
          return x.trim();
        })
        .filter(Boolean);
    }
    if (Array.isArray(r)) return r.map(String);
    return [];
  }

  function getSession() {
    var token = getToken();
    if (!token) return null;
    var p = parseJwtPayload(token);
    if (!p) return null;
    if (p.exp != null && Date.now() / 1000 > Number(p.exp)) return null;
    var uid = p.user_id != null ? Number(p.user_id) : null;
    return {
      token: token,
      userId: uid,
      roles: normalizeRoles(p),
      exp: p.exp != null ? Number(p.exp) : null,
      raw: p,
    };
  }

  function hasRole(role) {
    var s = getSession();
    if (!s) return false;
    return s.roles.indexOf(role) !== -1;
  }

  function hasAnyRole(roles) {
    if (!roles || !roles.length) return false;
    var s = getSession();
    if (!s) return false;
    for (var i = 0; i < roles.length; i++) {
      if (s.roles.indexOf(roles[i]) !== -1) return true;
    }
    return false;
  }

  function authHeaders() {
    var t = getToken();
    if (!t) return {};
    return { Authorization: 'Bearer ' + t };
  }

  function apiUrl(path) {
    var base = getApiBase();
    if (!base) return path;
    if (path.charAt(0) !== '/') path = '/' + path;
    return base + path;
  }

  function logout() {
    setToken('');
  }

  function login(email, password) {
    if (!getApiBase()) return Promise.reject(new Error('no_api_base'));

    return fetch(apiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (t) {
            throw new Error(t || 'login_failed');
          });
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.token) throw new Error('no_token');
        setToken(data.token);
        return getSession();
      });
  }

  function register(payload) {
    if (!getApiBase()) return Promise.reject(new Error('no_api_base'));

    return fetch(apiUrl('/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
      }),
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(t || 'register_failed');
        });
      }
      return true;
    });
  }

  global.JBAuth = {
    TOKEN_KEY: TOKEN_KEY,
    API_KEY: API_KEY,
    STUB_LS_KEY: STUB_LS_KEY,
    STAFF_ROLES: STAFF_ROLES,
    getApiBase: getApiBase,
    setApiBase: setApiBase,
    getToken: getToken,
    setToken: setToken,
    parseJwtPayload: parseJwtPayload,
    getSession: getSession,
    hasRole: hasRole,
    hasAnyRole: hasAnyRole,
    authHeaders: authHeaders,
    apiUrl: apiUrl,
    logout: logout,
    login: login,
    register: register,
  };
})(typeof window !== 'undefined' ? window : this);
