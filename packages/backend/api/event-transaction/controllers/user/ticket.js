module.exports = {
  getUserTickets: async (ctx) => {
    const { id: userID } = ctx.state.user;

    const userTickets = await strapi.services["event-transaction"]
      .find({
        user_id: userID,
        status: ["successful"],
        _sort: 'created_at:desc',
        _limit: 200,
      }, ["event_table_reserveds"]);

    const eventIDs = [...new Set(userTickets.map(e => e.event_id))]
    const events = await strapi.query("event").find({
      id_in: eventIDs
    }, ["branch", "rounds"])

    const results = userTickets.map(tk => {
      const event = events.find(b => b.id == tk.event_id)
      if (!event) return null
      const round = event.rounds.find(r => r.id == tk.round_id)
      if (!round) return null

      return {
        id: tk.id,
        title: event.title,
        type: event.type,
        date: round.date,
        tables: tk.description,
        branch_name: event.branch?.name || "-",
        price: tk.price,
        points: tk.points,
        status: tk.status,
      }
    })

    return results.filter(r => !!r);
  },
  cancelUserTicket: async (ctx) => {
    const { id: userID } = ctx.state.user;
    const { transaction_id } = ctx.request.body;

    strapi.log.info('[EventTransaction][cancelUserTicket]', { userID, transaction_id });

    // Check transaction_id match with userID
    const transaction = await strapi.services["event-transaction"]
    .findOne({
      id: transaction_id,
      user_id: userID,
      status: "successful",
    }, []);

    if (!transaction) {
      strapi.log.error('[EventTransaction][cancelUserTicket] Transaction not match', { userID, transaction_id });
      throw strapi.errors.badRequest("Transaction not match", { code: 400, message: "Transaction not match" });
    }

    const redempResult = await strapi.services["event-transaction"].refundService({
      userID,
      transactionID:  transaction.id,
      paymentTransactionID: transaction.payment_transaction_id,
    });
    return redempResult;
  },
}