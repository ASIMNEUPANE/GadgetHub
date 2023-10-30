
const productModel = require("./product.model");
const {ObjectId} = require("mongoose").Types;








const create = async (payload) => {
  return await productModel.create(payload);
};

const list = async (limit, page, search) => {
  const pageNum = parseInt(page) || 1;
  const limits = parseInt(limit) || 5;
  const { name } = search;
  const query = {};
  if (name) {
    query.name = new RegExp(name, "gi");
  }
  const response = await productModel
    .aggregate([
      {
        $match: query,
      },
      {
        $sort: {
          created_at: -1,
        },
      },
      {
        $facet: {
          metadata: [
            {
              $count: "total",
            },
          ],
          data: [
            {
              $skip: (pageNum - 1) * limits,
            },
            {
              $limit: limits,
            },
          ],
        },
      },
      {
        $addFields: {
          total: {
            $arrayElemAt: ["$metadata.total", 0],
          },
        },
      },
      {
        $project: {
          data: 1,
          total: 1,
        },
      },
    ])
    .allowDiskUse(true);
  const newData = response[0];
  const { data, total } = newData;
  return { data, total, limit, pageNum };
};

const getById = async (id) => {
  const result = await productModel.aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category_name",
      },
    },
    {
      $unwind: {
        path: "$category_name",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        category_name: "$category_name.name",
      },
    },
  ]).allowDiskUse(true);
  if(result.length ===0)return{}
  return result[0];
};

const updateById = async (id, payload) => {
  const { products, ...rest } = payload;
  return await productModel.findOneAndUpdate({ _id: id }, rest, { new: true });
};

const deleteById = async (id, payload) => {
  return await productModel.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};
const approve = async (id, payload) => {
  const { status } = payload;
  return model.findOneAndUpdate({ id }, { status }, { new: true });
};

module.exports = { approve, create, list, getById, updateById, deleteById };
