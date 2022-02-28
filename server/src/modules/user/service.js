// load repository.js
const { save, update, getById, deleteById } = require('../../core/repository');
const Model = require("./model");
const eventEmitter = require('../../core/event-manager').getInstance();

const modelName = 'User';

const search = async (payload) => {
    const queries = [];

    if (payload.name) {
        // search by payload.name is firstName or payload.name is lastName or payload.name is email
        queries.push({ $or: [{ firstName: { $regex: payload.name, $options: 'i' } }, { lastName: { $regex: payload.name, $options: 'i' } }, { email: { $regex: payload.name, $options: 'i' } }] });
    }


    const query = queries.length > 1 ? { $and: queries } : queries.length == 1 ? queries[0] : {};
    const take = parseInt(payload.pageSize);
    const skip = (parseInt(payload.current) - 1) * take;

    // sort 
    let sort = {};
    if (payload.sort) {
        let key = payload.sort;
        let value = parseInt(payload.order) ?? 1;
        sort[key] = value;
    }
    else {
        sort = { updatedAt: -1 };
    }

    const data = await Model.collection.find(query).sort(sort).skip(skip).limit(take);
    let items = { data: (await data.toArray()), total: 200 };
    return items;
};

const count = async (payload) => {
    const queries = [];

    if (payload.keyword) {
        // search by payload.name is firstName or payload.name is lastName or payload.name is email
        queries.push({ $or: [{ firstName: { $regex: payload.keyword, $options: 'i' } }, { lastName: { $regex: payload.keyword, $options: 'i' } }, { username: { $regex: payload.keyword, $options: 'i' } }, { email: { $regex: payload.keyword, $options: 'i' } }] });
    }

    const query = queries.length > 1 ? { $and: queries } : queries.length == 1 ? queries[0] : {};
    const t = await Model.collection.find(query).count();
    let items = { total: t };
    return items;
};


module.exports = { save, update, deleteById, getById, search, count };
