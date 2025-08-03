const mongoose = require('mongoose');

//const getNextSeq = require('./getNestSeq');
const Todo_User = require('../model/Todo_User');//會員
const Todo_merchant = require('../model/Todo_merchant');//店家
const Todo_consumer = require('../model/Todo_consumer');//消費者
const Todo_order = require('../model/Todo_order');//訂單
const Todo_Items = require('../model/Todo_Items');//訂單明細
const Todo_simple = require('../model/Todo_simple');//訂單簡表

const modelMap  = {
    user:Todo_User,//會員
    merchant:Todo_merchant,//店家
    consumer:Todo_consumer,//消費者
    order:Todo_order,//訂單
    items:Todo_Items,//訂單明細
    simple:Todo_simple//訂單簡表
}

async function insertOne(collectionName, data = {}) {
  const Model = modelMap[collectionName];
  if (!Model) {
    return { success: false, error: `❌ 未支援的 collection: ${collectionName}` };
  }

  try {
    // // 自動產生 _id
    // const nextId = await getNextSeq(collectionName);
    // data._id = nextId;

    // 自動補同步 xxx_id（例如 member_id）
    const idField = Object.keys(data).find(field => field.endsWith('_id') && field !== '_id');
    if (idField && !data[idField]) {
      data[idField] = nextId;
    }

    // 自動補上 created_at（若 schema 有）
    if (!data.created_at) {
      data.created_at = new Date();
    }

    const doc = new Model(data);
    const saved = await doc.save();

    // 處理特殊後續：若是 members（user）要拆子表
    if (collectionName === 'user') {
      const role = saved.role;
      const memberID = saved._id;

      const userBase = {
        member_ID: memberID,
        account: saved.account,
        password: saved.password,
        name: saved.name,
        email: saved.email,
        phone: saved.phone
      };

      if (role === 'shop') {
        // 建立 merchant
        const merchantResult = await insertOne('merchant', {
          ...userBase,
          storeName: saved.storename,
          storeAddress: saved.address
        });

        // 回寫 merchant_ID
        if (merchantResult.success) {
          await Model.updateOne(
            { _id: memberID },
            { $set: { merchant_ID: merchantResult.data._id } }
          );
        }

        const updated = await Model.findById(memberID);
        return { success: true, data: updated.toObject() };

      } else if (role === 'user') {
        await insertOne('consumer', userBase);
        return { success: true, data: saved.toObject() };
      }
    }

    return { success: true, data: saved.toObject() };

  } catch (err) {
    // 優化錯誤訊息顯示（特別處理 unique key）
    let msg = err.message || err;
    if (err.code === 11000 && err.keyValue) {
      const dupField = Object.keys(err.keyValue)[0];
      msg = `欄位 "${dupField}" 已被使用`;
    }
    return { success: false, error: msg };
  }
}

module.exports = insertOne;


