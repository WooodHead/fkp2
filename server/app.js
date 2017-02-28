// require('coffee-script/register');
import init from './init'
import request from 'request'
const refreshUrl = 'http://localhost:3000/__browser_sync__?method=reload'
async function startServer(){
  try {
    const server = await init()
    server.listen(CONFIG.port, function(){
      if (process.env.whichMode!='pro') {
        request(refreshUrl, function (error, response, body) {
          if (error) console.log('server will be start');
        })
      }
    })
  } catch (e) {
    console.error(e.stack)
  }
}
startServer()
