import fs from 'fs'
import router from '../../route'
import path from 'path'
import asyncBusboy from 'async-busboy';

function checkFiles(fields){
  let filterPicture = ['.jpg','.jpeg','.png','.gif']
  if (fields) {
    let ext = path.extname(fields.name)
    if (filterPicture.indexOf(ext)>-1) {
      return true
    }
  }
}
async function uploader(ctx, next){
  if (!ctx.request.is('multipart/*')) return next()
  let fkp = ctx.fkp
  const {files, fields} = await asyncBusboy(ctx.req)

  // fields
  // {
  //   id: 'WU_FILE_0',
  // name: 'logo32.png',
  // type: 'image/png',
  // lastModifiedDate: 'Tue Nov 22 2016 23:31:02 GMT+0800 (CST)',
  // size: '2661'
  // }

  let filename
  , o_filename
  , path2save = CONFIG.upload.root

  if (checkFiles(fields)) {
    filename = o_filename = fields.name
    filename = path.join(path2save, filename)
    let stream = fs.createWriteStream(filename)
    files[0].pipe(stream)
    ctx.body = {
      "state": "success",
      "url": '/upload/'+o_filename,
      "original": o_filename,
      "message": o_filename       
    }
  }
}

export default function(fkp){
  fkp.routepreset('/upup', {
    customControl: uploader
  })
}
