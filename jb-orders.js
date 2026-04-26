/**
 * Заказы через API бэка Jasmin.
 */
(function (global) {
  'use strict';

  var EVT = 'jh_orders_updated';

  /**
   * @param {object} payload — items[], total, currencyLabel, customerName, phone, address
   */
  function addOrder(payload) {
    if (!global.JBAuth || !global.JBAuth.getApiBase || !global.JBAuth.getApiBase()) {
      return Promise.reject(new Error('no_api_base'));
    }
    var url = global.JBAuth.apiUrl('/orders');
    return fetch(url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, global.JBAuth.authHeaders()),
      body: JSON.stringify(payload || {}),
    })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (t) {
            throw new Error(t || 'order_failed');
          });
        }
        return res.json();
      })
      .then(function (data) {
        try {
          global.dispatchEvent(new Event(EVT));
        } catch (e) {}
        return data;
      });
  }

  function updateStatus(id, status) {
    if (!global.JBAuth || !global.JBAuth.getApiBase || !global.JBAuth.getApiBase()) {
      return Promise.reject(new Error('no_api_base'));
    }
    var url = global.JBAuth.apiUrl('/orders/' + encodeURIComponent(String(id)) + '/status');
    return fetch(url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, global.JBAuth.authHeaders()),
      body: JSON.stringify({ status: status }),
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(t || 'order_status_failed');
        });
      }
      try {
        global.dispatchEvent(new Event(EVT));
      } catch (e) {}
      return true;
    });
  }

  global.JBOrders = {
    EVENT: EVT,
    addOrder: addOrder,
    updateStatus: updateStatus,
  };
})(typeof window !== 'undefined' ? window : this);
