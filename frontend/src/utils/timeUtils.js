// src/utils/timeUtils.js
import { DateTime } from 'luxon';

// const day = weekdayMap[now.weekday % 7]; // Luxon: 1 = Monday, 7 = Sunday
const weekdayMap = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// const day = weekdayMap[now.weekday -1 ]; // Luxon: 1 = Monday → index 0
// const weekdayMap = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function isStoreOpen(schedule, timezone = 'Asia/Taipei') {
  const now = DateTime.now().setZone(timezone);

  // const daytest = now.weekdayLong.toLowerCase(); 
  // weekdayLong => en: 'friday' , zh: '星期六' 會抓到中文
  // console.log('weekdayLong test', daytest);
  // console.log('now.weekday', now.weekday);
  
  const day = weekdayMap[now.weekday % 7]; // Luxon: 1 = Monday, 7 = Sunday
  // sunday => now.weekday = 7 => weekdayMap[0]
  // monday => now.weekday = 1 => weekdayMap[1]
  // saturday => now.weekday = 6 => weekdayMap[6]

  // const day = weekdayMap[now.weekday -1 ]; // Luxon: 1 = Monday → index 0
  // monday => now.weekday = 1 => weekdayMap[0]
  // saturday => now.weekday = 6 => weekdayMap[5] 
  // sunday => now.weekday = 7 => weekdayMap[6] 

  // console.log('day', day);

  const todaySchedule = schedule?.[day];

  // console.log(`[isStoreOpen] 現在是 ${day} ->`, now.toFormat('HH:mm'));
  
  // console.log(`[isStoreOpen] 今日設定 ->`, todaySchedule);
  // schedule[saturday]
  // {isOpen: true, openTime: '06:00', closeTime: '21:00'}

  // console.log(`[todaySchedule.isOpen]  ->`, todaySchedule.isOpen);
  // console.log(`[todaySchedule.openTime]  ->`, todaySchedule.openTime);
  // console.log(`[todaySchedule.closeTime]  ->`, todaySchedule.closeTime);

  if (!todaySchedule?.isOpen) return { isOpen: false, reason: 'closed today' };

  const open = DateTime.fromFormat(todaySchedule.openTime.trim(), 'HH:mm', { zone: timezone });
  const close = DateTime.fromFormat(todaySchedule.closeTime.trim(), 'HH:mm', { zone: timezone });

  if (!open.isValid || !close.isValid) return { isOpen: false, reason: 'invalid time format' };

  // Debug log
  // console.log(`[isStoreOpen] ${day} → now: ${now.toFormat('HH:mm')}, open: ${open.toFormat('HH:mm')}, close: ${close.toFormat('HH:mm')}`);

  // if (close < open) {
  //   // 跨日營業（例如 22:00–02:00）
  //   return now >= open || now <= close;
  // }
  // return now >= open && now <= close;

    const isOpenNow = close < open
    ? now >= open || now <= close
    : now >= open && now <= close;

  return {
    isOpen: isOpenNow,
    openTime: todaySchedule.openTime,
    closeTime: todaySchedule.closeTime,
    reason: isOpenNow ? 'open' : 'closed now',
  };
}