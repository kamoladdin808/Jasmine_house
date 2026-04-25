/**
 * Геолокация посетителя: localStorage + обратное геокодирование (Nominatim).
 */
(function (global) {
  'use strict';

  var KEY = 'jh_user_geo';
  var DISMISS_UNTIL = 'jh_geo_dismiss_until';
  var SESSION_SHOWN = 'jh_geo_modal_session';
  var EVT = 'jh_geo_updated';
  var FRESH_MS = 7 * 24 * 60 * 60 * 1000;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (o == null || typeof o !== 'object') return null;
      return o;
    } catch (e) {
      return null;
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
    try {
      global.dispatchEvent(new CustomEvent(EVT, { detail: data }));
    } catch (e2) {}
  }

  /**
   * Собирает максимально полный адрес из ответа Nominatim (улица, дом, кв/корпус, индекс, город).
   * Квартира попадёт только если она есть в данных OSM (редко).
   */
  function buildFullAddress(j) {
    if (!j) return null;
    var a = j.address;
    if (!a) {
      return j.display_name ? String(j.display_name).trim() : null;
    }

    function pickRoad() {
      return (
        a.road ||
        a.pedestrian ||
        a.footway ||
        a.path ||
        a.residential ||
        a.living_street ||
        a.neighbourhood ||
        a.quarter ||
        a.suburb ||
        ''
      );
    }

    var road = pickRoad();
    var house =
      a.house_number ||
      a.house ||
      (typeof a['addr:housenumber'] === 'string' ? a['addr:housenumber'] : '') ||
      '';
    var unit =
      a.unit || (typeof a['addr:unit'] === 'string' ? a['addr:unit'] : '') || '';
    var building = a.building && a.building !== 'yes' ? a.building : '';
    var entrance = a.entrance || '';

    var localParts = [];
    if (road) localParts.push(road);
    if (house) localParts.push('д. ' + String(house));
    if (building) localParts.push(building);
    if (entrance) localParts.push('под. ' + entrance);
    if (unit) localParts.push('кв. ' + String(unit));

    var localLine = localParts.length ? localParts.join(', ') : '';

    var city =
      a.city ||
      a.town ||
      a.village ||
      a.municipality ||
      a.hamlet ||
      a.city_district ||
      '';

    var postcode = a.postcode || '';

    var region = a.state || a.region || a.county || '';
    if (region === city) region = '';

    var tail = [];
    if (postcode) tail.push(postcode);
    if (city) tail.push(city);
    if (region) tail.push(region);
    if (a.country) tail.push(a.country);

    var tailLine = tail.join(', ');
    var out = [localLine, tailLine].filter(Boolean).join(', ').trim();
    if (out) return out;

    if (j.display_name) {
      return String(j.display_name)
        .split(',')
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean)
        .slice(0, 10)
        .join(', ');
    }
    return null;
  }

  function reverseGeocode(lat, lng, cb) {
    var q =
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=' +
      encodeURIComponent(lat) +
      '&lon=' +
      encodeURIComponent(lng);
    fetch(q, {
      method: 'GET',
      headers: {
        'Accept-Language': 'ru,uz,en',
        'User-Agent': 'JasminHouse/1.0 (contact@jasminhouse.uz)'
      },
      mode: 'cors',
    })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (j) {
        if (!j) {
          cb(null);
          return;
        }
        cb(buildFullAddress(j));
      })
      .catch(function () {
        cb(null);
      });
  }

  function mergeSaved(patch) {
    var cur = load() || {};
    for (var k in patch) {
      if (Object.prototype.hasOwnProperty.call(patch, k)) cur[k] = patch[k];
    }
    save(cur);
    return cur;
  }

  /**
   * Запрос геолокации у браузера.
   * @param {{ onSuccess?: function, onError?: function, onProgress?: function }} opt
   */
  function request(opt) {
    opt = opt || {};
    if (!navigator.geolocation) {
      if (opt.onError) opt.onError({ code: 0, message: 'NO_API' });
      return;
    }
    if (opt.onProgress) opt.onProgress(true);
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        var base = {
          lat: lat,
          lng: lng,
          accuracy: pos.coords.accuracy,
          ts: Date.now(),
          label: null,
        };
        mergeSaved(base);
        reverseGeocode(lat, lng, function (label) {
          if (opt.onProgress) opt.onProgress(false);
          var data = mergeSaved({ label: label });
          if (opt.onSuccess) opt.onSuccess(data);
        });
      },
      function (err) {
        if (opt.onProgress) opt.onProgress(false);
        if (opt.onError) opt.onError(err);
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  }

  function dismissLater(hours) {
    hours = hours || 24;
    try {
      localStorage.setItem(DISMISS_UNTIL, String(Date.now() + hours * 60 * 60 * 1000));
    } catch (e) {}
    markModalShown();
  }

  function markModalShown() {
    try {
      sessionStorage.setItem(SESSION_SHOWN, '1');
    } catch (e) {}
  }

  function shouldShowPrompt() {
    try {
      if (sessionStorage.getItem(SESSION_SHOWN) === '1') return false;
    } catch (e) {}
    var until = parseInt(localStorage.getItem(DISMISS_UNTIL), 10);
    if (until && !isNaN(until) && Date.now() < until) return false;
    var g = load();
    if (g && g.lat != null && g.lng != null && g.ts && Date.now() - g.ts < FRESH_MS) return false;
    return true;
  }

  global.JBGeo = {
    KEY: KEY,
    EVENT: EVT,
    load: load,
    request: request,
    shouldShowPrompt: shouldShowPrompt,
    dismissLater: dismissLater,
    markModalShown: markModalShown,
  };
})(typeof window !== 'undefined' ? window : this);
