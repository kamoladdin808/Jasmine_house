/**
 * Демо-очередь заказов (localStorage) — общая для menu.html и staff.html, пока нет бэка.
 */
(function (global) {
  'use strict';

  var KEY = 'jh_demo_orders';
  var EVT = 'jh_orders_updated';

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function save(orders) {
    try {
      localStorage.setItem(KEY, JSON.stringify(orders));
    } catch (e) {}
    try {
      global.dispatchEvent(new Event(EVT));
    } catch (e2) {}
  }

  function nextId() {
    var orders = load();
    var max = 1000;
    for (var i = 0; i < orders.length; i++) {
      var id = Number(orders[i].id);
      if (!isNaN(id) && id > max) max = id;
    }
    return max + 1;
  }

  /**
   * @param {object} payload — items[], total, currencyLabel, customerName, phone, address
   */
  function addOrder(payload) {
    var orders = load();
    var row = {
      id: nextId(),
      status: 'new',
      createdAt: Date.now(),
      items: payload.items || [],
      total: payload.total || 0,
      currencyLabel: payload.currencyLabel || '',
      customerName: String(payload.customerName || '').trim(),
      phone: String(payload.phone || '').trim(),
      address: String(payload.address || '').trim(),
    };
    orders.unshift(row);
    save(orders);
    return row.id;
  }

  function updateStatus(id, status) {
    var orders = load();
    var n = Number(id);
    for (var i = 0; i < orders.length; i++) {
      if (Number(orders[i].id) === n) {
        orders[i].status = status;
        save(orders);
        return true;
      }
    }
    return false;
  }

  global.JBOrders = {
    KEY: KEY,
    EVENT: EVT,
    load: load,
    save: save,
    addOrder: addOrder,
    updateStatus: updateStatus,
  };
})(typeof window !== 'undefined' ? window : this);
