#!/bin/bash

# nodemon 参数
ignore_file1="--ignore libs/_component/forapp.js --ignore libs/_component/clipborder.js"
ignore_file2="--ignore libs/_component/doc.js --ignore libs/_component/tips.js"

ignore_file2="--ignore libs/_component/"
ignore_file3="--ignore libs/libs_client.js --ignore libs/pages.jsx --ignore libs/router.jsx --ignore libs/api.js"
ignore_file="$ignore_file2  $ignore_file3"

nodemon_ignore="$ignore_file --ignore public/ --ignore dist/ --ignore .git/ --ignore node_modules/"
nodemon_ext="-e js,jsx,css,html"
nodemon_file="index.js"
nodemon_harmony="--harmony index.js"
nodemon_watch=""
nodemon_param="$nodemon_ext $nodemon_ignore $nodemon_harmony"

# dev
dev(){
    if [ $1 ]; then
        node index.js dev &
        # nodemon $nodemon_param dev $1 &
    else
        node index.js dev &
        # nodemon $nodemon_param dev &
    fi

    gulp dev

}

pro(){
    if [ $1 ]; then
        node index.js pro &
        # nodemon $nodemon_param pro $1 &
    else
        node index.js pro &
        # nodemon $nodemon_param pro &
    fi

    gulp pro
}

demo(){
    gulp demo
}

install(){
    # read -s -p "请输入sudo密码: " psd
    # echo $psd | sudo npm install nrm -g
    # nrm use cnpm
    # sleep 3
    # echo $psd | sudo npm install gulp -g
    # echo $psd | sudo npm install nodemon -g
    # echo $psd | sudo npm install node-gyp -g

    sudo npm install nrm -g
    nrm use cnpm
    sleep 3
    sudo npm install gulp -g
    sudo npm install nodemon -g
    sudo npm install node-gyp -g

    npm install
}

build(){
    gulp build
    # pm2 restart all
}

case $1 in
  i)
      install
      ;;
  install)
      install
      ;;
  dev)
      dev $2
      ;;
  pro)
      pro $2
      ;;
  demo)
      demo
      ;;
  build)
      build
      ;;
esac
