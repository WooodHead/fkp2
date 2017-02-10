import {inject} from 'libs'
// 动态注入静态资源
export default function(cb){
  const injectStatic = inject()
  injectStatic.css(`
    .logo{
      list-style: none;
      padding: 0;
    }
    .logo li{
      display: inline-block;
    }
    .logo a{
      display: block;
      width: 48px;
      height: 48px;
    }
    .logo .github{
      background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEyOCAxMjgiIGlkPSJTb2NpYWxfSWNvbnMiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxnIGlkPSJfeDMxX19zdHJva2UiPjxnIGlkPSJHaXRodWJfMV8iPjxyZWN0IGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBoZWlnaHQ9IjEyOCIgd2lkdGg9IjEyOCIvPjxwYXRoIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTYzLjk5NiwxLjMzM0MyOC42NTYsMS4zMzMsMCwzMC4wOTksMCw2NS41OTEgICAgYzAsMjguMzg0LDE4LjMzNiw1Mi40NjcsNDMuNzcyLDYwLjk2NWMzLjIsMC41OSw0LjM2OC0xLjM5NCw0LjM2OC0zLjA5NmMwLTEuNTI2LTAuMDU2LTUuNTY2LTAuMDg4LTEwLjkyNyAgICBjLTE3LjgwNCwzLjg4My0yMS41Ni04LjYxNC0yMS41Ni04LjYxNGMtMi45MDgtNy40MjEtNy4xMDQtOS4zOTctNy4xMDQtOS4zOTdjLTUuODEyLTMuOTg4LDAuNDQtMy45MDcsMC40NC0zLjkwNyAgICBjNi40MiwwLjQ1NCw5LjgsNi42MjIsOS44LDYuNjIyYzUuNzEyLDkuODE5LDE0Ljk4LDYuOTg0LDE4LjYyOCw1LjMzN2MwLjU4LTQuMTUyLDIuMjM2LTYuOTg0LDQuMDY0LTguNTkgICAgYy0xNC4yMTItMS42MjItMjkuMTUyLTcuMTMyLTI5LjE1Mi0zMS43NTNjMC03LjAxNiwyLjQ5Mi0xMi43NSw2LjU4OC0xNy4yNDRjLTAuNjYtMS42MjYtMi44NTYtOC4xNTYsMC42MjQtMTcuMDAzICAgIGMwLDAsNS4zNzYtMS43MjcsMTcuNiw2LjU4NmM1LjEwOC0xLjQyNiwxMC41OC0yLjEzNiwxNi4wMjQtMi4xNjVjNS40MzYsMC4wMjgsMTAuOTEyLDAuNzM5LDE2LjAyNCwyLjE2NSAgICBjMTIuMjE2LTguMzEzLDE3LjU4LTYuNTg2LDE3LjU4LTYuNTg2YzMuNDkyLDguODQ3LDEuMjk2LDE1LjM3NywwLjYzNiwxNy4wMDNjNC4xMDQsNC40OTQsNi41OCwxMC4yMjgsNi41OCwxNy4yNDQgICAgYzAsMjQuNjgxLTE0Ljk2NCwzMC4xMTUtMjkuMjIsMzEuNzA1YzIuMjk2LDEuOTg0LDQuMzQ0LDUuOTAzLDQuMzQ0LDExLjg5OWMwLDguNTktMC4wOCwxNS41MTctMC4wOCwxNy42MjYgICAgYzAsMS43MTksMS4xNTIsMy43MTksNC40LDMuMDg4QzEwOS42OCwxMTguMDM0LDEyOCw5My45NjcsMTI4LDY1LjU5MUMxMjgsMzAuMDk5LDk5LjM0NCwxLjMzMyw2My45OTYsMS4zMzMiIGZpbGw9IiMzRTc1QzMiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaWQ9IkdpdGh1YiIvPjwvZz48L2c+PC9zdmc+");
      background-repeat: no-repeat;
    }
    .modal-container{
      padding: 16px;
    }
    .inputGroup input[type=text]{
      width: 10em;
      height: 1.8em;
    }
    .inputGroup input[type=password]{
      width: 10em;
      height: 1.8em;
    }
    .inputGroup .inputItem input[type=button]{
      border: 1px solid #ccc;
    }
  `)

  if ($('#epiceditor').length) {
    injectStatic
    .js(['/js/t/webuploader.js'], start)
  }

  function start(){
    let Uploader = require('component/modules/upload')
    injectStatic.js(['/js/t/epic/js/epiceditor.js'], ()=>{
      cb({}, Uploader)
    })
  }
}
