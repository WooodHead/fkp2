# demo: slime will server it
# dev: node will server
# pro: node will server
# build: no server
# this module will write map file about static js/css
module.exports = (gulp, $, slime, env)->
    return (cb)->
      slime.mapfile()
      if process.env.WATCH_FILE is 'true'
        slime.watch()
