const Hapi = require('@hapi/hapi')
const routes = require('./routes')

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost'
  })

  try {
    server.route(routes)
  } catch (error) {
    console.error(error)
    return error
  }

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
