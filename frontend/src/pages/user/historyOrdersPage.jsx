// src/pages/user/HistoryOrdersPage.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/UserData";
import "../../styles/usercss/historyOrdersPage.css";

export default function HistoryOrdersPage() {
  const user = useContext(UserContext);                 // 只靠 Context
  const memberId = user?.member_id || null;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    if (!memberId) { setLoading(false); return; }

    (async () => {
      try {
        const url = `http://localhost:3001/order/history/${memberId}`;
        const res = await axios.get(url, { withCredentials: true });
        if (mounted) setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("取得歷史訂單失敗", e);
        if (mounted) setErrMsg("取得歷史訂單失敗，請稍後再試");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [memberId]);

  // 小工具們
  const twd = (n) =>
    (Number(n) || 0).toLocaleString("zh-TW", { style: "currency", currency: "TWD", minimumFractionDigits: 0 });
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const labelOf = (d) => {
    const now = new Date();
    const sd = startOfDay(d);
    const sn = startOfDay(now);
    const diffDays = Math.round((sn - sd) / 86400000);
    const weekday = "日一二三四五六"[d.getDay()];
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    // 範例：8/5（週二）
    return `${d.getMonth() + 1}/${d.getDate()}（週${weekday}）`;
  };

  // 將資料同時相容 orderItems 與 content，並群組 + 合計
  const { groups, groupOrder } = useMemo(() => {
    const map = new Map(); // label -> { label, total, items: [order] }
    const serial = [];     // 依時間排序的日期標籤
    const normalizeOrder = (o) => {
      const items = o.orderItems || o.content || [];
      const total = o.totalPrice ?? o.total_amount ?? items.reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0
      );
      const created = o.createdAt ? new Date(o.createdAt) : null;
      return { ...o, _items: items, _total: total, _created: created };
    };

    const sorted = [...orders]
      .map(normalizeOrder)
      .sort((a, b) => (b._created?.getTime() || 0) - (a._created?.getTime() || 0));

    for (const o of sorted) {
      const d = o._created || new Date();
      const key = labelOf(d);
      if (!map.has(key)) {
        map.set(key, { label: key, total: 0, items: [] });
        serial.push({ key, ts: startOfDay(d).getTime() });
      }
      const g = map.get(key);
      g.total += o._total;
      g.items.push(o);
    }

    // 讓群組依日期新到舊
    serial.sort((a, b) => b.ts - a.ts);
    return {
      groups: map,
      groupOrder: serial.map((i) => i.key),
    };
  }, [orders]);

  // 折疊狀態（今天/昨天預設展開，其他預設收起）
  const [openMap, setOpenMap] = useState({});
  useEffect(() => {
    const next = {};
    for (const key of groupOrder) {
      next[key] = (key === "今天" || key === "昨天");
    }
    setOpenMap(next);
  }, [groupOrder]);

  const toggle = (key) => setOpenMap((m) => ({ ...m, [key]: !m[key] }));
  const openAll = () => setOpenMap((m) => Object.fromEntries(groupOrder.map(k => [k, true])));
  const closeAll = () => setOpenMap((m) => Object.fromEntries(groupOrder.map(k => [k, false])));

  // UI 狀態
  if (loading) return (
    <div className="history-cute">
      <h2 className="page-title">📜 歷史訂單</h2>
      <div className="skeleton">載入中…</div>
    </div>
  );
  if (errMsg) return (
    <div className="history-cute">
      <h2 className="page-title">📜 歷史訂單</h2>
      <div className="error">{errMsg}</div>
    </div>
  );
  if (!memberId) return (
    <div className="history-cute">
      <h2 className="page-title">📜 歷史訂單</h2>
      <div className="info">尚未登入或使用者資料載入中</div>
    </div>
  );
  if (orders.length === 0) return (
    <div className="history-cute">
      <h2 className="page-title">📜 歷史訂單</h2>
      <div className="empty">還沒有訂單喔，去點餐試試 🍔</div>
    </div>
  );

  return (
    <div className="history-cute">
      <div className="page-header">
        <h2 className="page-title">📜 歷史訂單</h2>
        <div className="toolbar">
          <button className="btn ghost" onClick={closeAll}>全部收合</button>
          <button className="btn primary" onClick={openAll}>全部展開</button>
        </div>
      </div>

      {groupOrder.map((key) => {
        const group = groups.get(key);
        const opened = !!openMap[key];
        return (
          <section key={key} className={`date-group ${opened ? "open" : "closed"}`}>
            <button className="group-header" onClick={() => toggle(key)}>
              <span className={`chev ${opened ? "down" : "right"}`} />
              <span className="date-label">🗓 {group.label}</span>
              <span className="chip count">🧾 {group.items.length} 筆</span>
              <span className="chip sum">💰 {twd(group.total)}</span>
            </button>

            {opened && (
              <div className="group-body">
                {group.items.map((order, idx) => {
                  const items = order._items || [];
                  const total = order._total || 0;
                  const t = order._created ? new Date(order._created) : null;
                  const time = t ? t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";
                  const shortId = order.order_id ? `#${String(order.order_id).slice(-6)}` : "";

                  return (
                    <div key={order._id || idx} className="order-card">
                      <div className="order-header">
                        <div className="left">
                          <span className="store">🍽 {order.storename || "未命名商家"}</span>
                          {shortId && <span className="badge">{shortId}</span>}
                        </div>
                        <div className="right">
                          <span className="clock">⏰ {time}</span>
                        </div>
                      </div>

                      <ul className="order-items">
                        {items.map((it, i) => (
                          <li key={i} className="order-item">
                            <div className="item-left">
                              <span className="dot" /> {it.name} × {it.quantity}
                              {it.note ? <em className="note">（{it.note}）</em> : null}
                            </div>
                            <div className="item-right">{twd(it.price)}</div>
                          </li>
                        ))}
                      </ul>

                      <div className="order-footer">
                        <span className="total">合計：{twd(total)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
