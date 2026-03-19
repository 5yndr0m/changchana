'use strict';

const PROCESS_TRANSACTION_API = [
  {
    path: "/api/users/check-out",
    transactionKeys: [
      { type: "user", key: "id" },
      { type: "body", key: "code" },
    ],
  }
];

const getTransactionKeyCtx = (ctx, transactionKey) => {
  let result;
  if (["body", "params"].indexOf(transactionKey.type) !== -1) {
    result = ctx.request[transactionKey.type][transactionKey.key];
  } else if (transactionKey.type === "user") {
    result = ctx.state.user[transactionKey.key];
  }

  return result;
};

module.exports = async (ctx, next) => {
  const routeName = ctx._matchedRoute;
  const transactionAPI = PROCESS_TRANSACTION_API.find((api) => api.path === routeName);
  let transactionID;

  if (transactionAPI) {
    const transactionKeys = transactionAPI.transactionKeys
      .map((tk) => getTransactionKeyCtx(ctx, tk))
      .filter((t) => t !== undefined);

    if (transactionKeys.length === transactionAPI.transactionKeys.length) {
      const transaction = await strapi.services["process-transactions"]
        .create({ name: ctx._matchedRoute, transaction_key: transactionKeys.join("::") })
        .catch((e) => {
          let message = e.message;

          if (e.message === "Duplicate entry") {
            message = 'Duplicate process';
          }

          throw strapi.errors.badRequest(message);
        });
      transactionID = transaction.id;
    }
  }

  let errors;
  try {
    await next();
  } catch (e) {
    errors = e;
  }

  if (transactionID) {
    strapi.services["process-transactions"].delete({ id: transactionID });
  }

  if (errors) {
    throw errors;
  }
};
