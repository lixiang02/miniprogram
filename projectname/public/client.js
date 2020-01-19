const path = require('path')
// const glob = require('glob')
const electron = require('electron')
const autoUpdater = require('./auto-updater')
//const ffi = require('ffi')

const BrowserWindow = electron.BrowserWindow
const app = electron.app


const debug = /--debug/.test(process.argv[2])

if (process.mas)
  app.setName('Electron APIs')

var mainWindow = null

function initialize() {
  // var shouldQuit = makeSingleInstance()
  // if (shouldQuit)
  //   return app.quit()

  // loadDemos()

  function createWindow() {
    var windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      autoHideMenuBar:true,
      opacity :0.9,
      title: app.getName(),
      icon : path.join(__dirname, 'icons.ico')
    }

    // if (process.platform === 'linux') {
    // }

    mainWindow = new BrowserWindow(windowOptions)

    // and load the index.html of the app.
     // mainWindow.loadURL('http://localhost:3000');
     mainWindow.webContents.on('paint', (event, dirty, image) => {
       // updateBitmap(dirty, image.getBitmap())
     })
     // mainWindow.webContents.setFrameRate(60)
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
    mainWindow.loadURL(path.join('file://', __dirname, './index.html'))

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      // mainWindow.webContents.openDevTools()
      // mainWindow.webContents.enableDeviceEmulation({
      //   screenPosition: 'mobile',
      //   screenSize: {
      //     width: 960,
      //     height: 576
      //   }
      // })
      mainWindow.maximize()
      // require('devtron').install()
      // const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');
      // console.log(REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS)
      // installExtension(REACT_DEVELOPER_TOOLS).then((name) => console.log(`Added Extension:  ${name}`)).catch((err) => console.log('An error occurred: ', err));
      // installExtension(REDUX_DEVTOOLS).then((name) => console.log(`Added Extension:  ${name}`)).catch((err) => console.log('An error occurred: ', err));
    }

    mainWindow.on('closed', function() {
      mainWindow = null
    })
  }

  app.on('ready', function() {
    createWindow()
    autoUpdater.initialize()
  })

  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function() {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas)
    return false

  return app.makeSingleInstance(function() {
    if (mainWindow) {
      if (mainWindow.isMinimized())
        mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadDemos() {
  // var files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  // files.forEach(function(file) {
  //   require(file)
  // })
  // autoUpdater.updateMenu()
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function() {
      app.quit()
    })
    break;
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function() {
      app.quit()
    })
    break;
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit()
    break;
  default:
    initialize()
}
