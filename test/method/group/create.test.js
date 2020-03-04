const test = require('tape')
const Server = require('../../server')
const Method = require('../../../method')
const { FeedId, MsgId } = require('../../../lib/cipherlinks')
const isCloaked = require('../../../lib/is-cloaked-msg-id')

test('method.group.create', t => {
  const server = Server()

  // hmmm ... think the raw method should be tested here
  // as in index.js we couple in the key-store
  const method = Method(server)

  const state = {
    feedId: new FeedId().mock().toTFK(),
    previous: new MsgId().mock().toTFK()
  }

  method.group.create(state, 'musk-rat paradise', (err, data) => {
    if (err) throw err

    const { groupId, groupKey } = data
    t.true(isCloaked(groupId), 'returns group identifier - groupId')
    t.true(Buffer.isBuffer(groupKey) && groupKey.length === 32, 'returns group symmetric key - groupKey')

    server.close()
    t.end()
  })
})