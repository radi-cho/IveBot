// Set up resolvers.
export default {
  // Queries.
  Query: {
    // Warns of user.
    allWarnsOfUser: (parent, { userId, serverId }, ctx, info) => ctx.db.query.warningDiscords({
      where: { warnedId: userId, serverId }
    }, info),
    serverSettings: (parent, { serverId }, ctx, info) => ctx.db.query.serverSettings({
      where: { serverId }
    }, info),
    allserverSettings: (parent, { serverId }, ctx, info) => ctx.db.query.serverSettings({
      where: {}
    }, info)
  },
  Mutation: {
    warn: (parent, {warnedId, warnerId, reason}, ctx, info) => ctx.db.mutation.createWarningDiscord(
      { data: { warnedId, warnerId, reason, date: new Date().toUTCString() } },
      info
    ),
    editServerSettings: (parent, { serverId, addRoleForAll }, ctx, info) => ctx.db.mutation.updateManyServerSettings(
      { data: { addRoleForAll, serverId }, where: { serverId } },
      info
    ),
    initServerSettings: (parent, { serverId }, ctx, info) => ctx.db.mutation.createServerSetting(
      { data: { serverId } },
      info
    )
  }
}
