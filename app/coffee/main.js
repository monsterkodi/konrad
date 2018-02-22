(function() {
  var Menu, Tray, Window, about, app, args, childp, colors, createWindow, dialog, electron, fileExists, first, fs, highlight, ipc, konrad, konradLastTask, konradVersion, log, noon, os, p, path, pkg, prefs, ref, resolve, saveBounds, screenSize, setRootDir, showAbout, showInactive, showWindow, startKonrad, toggleWindow, tray, win;

  ref = require('kxk'), fileExists = ref.fileExists, resolve = ref.resolve, about = ref.about, prefs = ref.prefs, first = ref.first, noon = ref.noon, os = ref.os, path = ref.path, fs = ref.fs, log = ref.log;

  pkg = require('../package.json');

  childp = require('child_process');

  electron = require('electron');

  colors = require('colors');

  app = electron.app;

  Window = electron.BrowserWindow;

  Tray = electron.Tray;

  Menu = electron.Menu;

  ipc = electron.ipcMain;

  dialog = electron.dialog;

  konrad = null;

  win = null;

  tray = null;

  showInactive = false;

  konradVersion = null;

  konradLastTask = [];

  args = require('karg')("\n" + pkg.productName + "\n\n    show      . ? open window on startup  . = false\n    prefs     . ? show preferences        . = false\n    noprefs   . ? don't load preferences  . = false\n    verbose   . ? log more                . = false\n    DevTools  . ? open developer tools    . = false\n    \nversion  " + pkg.version + "\n", {
    dontExit: true
  });

  if (args == null) {
    app.exit(0);
  }

  if (args.verbose) {
    log(colors.white.bold("\n" + pkg.productName, colors.gray("v" + pkg.version + "\n")));
    log(colors.yellow.bold('process'));
    p = {
      cwd: process.cwd()
    };
    log(noon.stringify(p, {
      colors: true
    }));
    log(colors.yellow.bold('args'));
    log(noon.stringify(args, {
      colors: true
    }));
    log('');
  }

  prefs.init({
    shortcut: 'command+F2'
  });

  if (args.prefs) {
    log(colors.yellow.bold('prefs'));
    log(colors.green.bold(prefs.store.file));
    if (fileExists(prefs.store.file)) {
      log(noon.stringify(noon.load(prefs.store.file), {
        colors: true
      }));
    }
  }

  ipc.on('openDevTools', function() {
    return win != null ? win.webContents.openDevTools() : void 0;
  });

  ipc.on('reloadWin', function() {
    return win != null ? win.webContents.reloadIgnoringCache() : void 0;
  });

  ipc.on('showWin', function() {
    return showWindow(true);
  });

  ipc.on('saveBounds', function() {
    return saveBounds();
  });

  ipc.on('highlight', function() {
    return highlight();
  });

  ipc.on('toggleMaximize', function() {
    if (win != null ? win.isMaximized() : void 0) {
      return win != null ? win.unmaximize() : void 0;
    } else {
      return win != null ? win.maximize() : void 0;
    }
  });

  startKonrad = function(rootDir) {
    prefs.set('rootDir', rootDir);
    konrad = childp.spawn("konrad -vw", {
      cwd: rootDir,
      shell: true
    });
    konrad.on('close', function(code) {
      log("konrad exit code: " + code);
      if (win != null) {
        return win.webContents.send('konradExit', "konrad exit code: " + code);
      } else {
        return createWindow('konradExit', "konrad exit code: " + code);
      }
    });
    konrad.stderr.on('data', function(data) {
      var s;
      s = data.toString();
      log("konrad error: " + s);
      if (win != null) {
        return win.webContents.send('konradError', "konrad error: " + s);
      } else {
        return createWindow('konradError', "konrad error: " + s);
      }
    });
    konrad.stdout.on('data', function(data) {
      var s;
      s = data.toString();
      if (/\ watching\ /.test(s)) {
        konradVersion = s.split('watching ')[1];
        return win != null ? win.send('konradVersion', konradVersion) : void 0;
      } else if (win != null) {
        return win.webContents.send('konradOutput', s);
      } else {
        if (/ 😡 /.test(s)) {
          return createWindow('konradOutput', s);
        } else {
          highlight();
          log('konrad output:', s);
          return konradLastTask.push(s);
        }
      }
    });
    return log('konrad started in', rootDir);
  };

  setRootDir = function() {
    var opts;
    opts = {
      title: 'Open',
      properties: ['openDirectory']
    };
    return dialog.showOpenDialog(opts, (function(_this) {
      return function(dirs) {
        var dir;
        if (dir = first(dirs)) {
          konrad.kill();
          return startKonrad(dir);
        }
      };
    })(this));
  };

  toggleWindow = function() {
    var ref1;
    if ((win != null ? win.isVisible() : void 0) && (win != null ? win.isFocused() : void 0)) {
      win.hide();
      return (ref1 = app.dock) != null ? ref1.hide() : void 0;
    } else {
      return showWindow();
    }
  };

  showWindow = function(inactive) {
    var ref1;
    if (win != null) {
      if (inactive) {
        win.showInactive();
      } else {
        win.show();
      }
    } else {
      showInactive = inactive;
      createWindow();
    }
    return (ref1 = app.dock) != null ? ref1.show() : void 0;
  };

  screenSize = function() {
    return electron.screen.getPrimaryDisplay().workAreaSize;
  };

  highlight = function() {
    var unhighlight;
    tray.setHighlightMode('always');
    unhighlight = function() {
      return tray.setHighlightMode('never');
    };
    return setTimeout(unhighlight, 1000);
  };

  createWindow = function(ipcMsg, ipcArg) {
    var bounds, h, ref1, w;
    bounds = prefs.get('bounds', null);
    if (!bounds) {
      ref1 = screenSize(), w = ref1.w, h = ref1.h;
      bounds = {};
      bounds.width = h + 122;
      bounds.height = h;
      bounds.x = parseInt((w - bounds.width) / 2);
      bounds.y = 0;
    }
    win = new Window({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      minWidth: 206,
      minHeight: 206,
      titleBarStyle: 'hidden',
      backgroundColor: '#000',
      maximizable: true,
      useContentSize: true,
      fullscreenable: false,
      show: false,
      autoHideMenuBar: true
    });
    bounds = prefs.get('bounds');
    if (bounds != null) {
      win.setBounds(bounds);
    }
    win.loadURL("file://" + __dirname + "/index.html");
    if (args.DevTools) {
      win.webContents.openDevTools();
    }
    win.on('closed', function() {
      return win = null;
    });
    win.on('close', function() {
      var ref2;
      return (ref2 = app.dock) != null ? ref2.hide() : void 0;
    });
    win.on('hide', function() {
      var ref2;
      return (ref2 = app.dock) != null ? ref2.hide() : void 0;
    });
    win.on('ready-to-show', function() {
      var i, len, ref2, t;
      if ((ref2 = app.dock) != null) {
        ref2.show();
      }
      if (showInactive) {
        win.showInactive();
        showInactive = false;
      } else {
        win.show();
      }
      if (konradVersion) {
        win.webContents.send('konradVersion', konradVersion);
      }
      if (ipcMsg) {
        win.webContents.send(ipcMsg, ipcArg);
      } else if (konradLastTask.length) {
        for (i = 0, len = konradLastTask.length; i < len; i++) {
          t = konradLastTask[i];
          win.webContents.send('konradOutput', t);
        }
      } else {
        win.webContents.send('clearLog');
      }
      return konradLastTask = [];
    });
    return win;
  };

  saveBounds = function() {
    if (win != null) {
      return prefs.set('bounds', win.getBounds());
    }
  };

  showAbout = function() {
    var dark;
    dark = 'dark' === prefs.get('scheme', 'dark');
    return about({
      img: __dirname + "/../img/about.png",
      color: dark && '#383838' || '#ddd',
      background: dark && '#282828' || '#fff',
      highlight: dark && '#ff0' || '#000',
      pkg: pkg
    });
  };

  app.on('window-all-closed', function(event) {
    return event.preventDefault();
  });

  app.on('ready', function() {
    var icon, ref1, rootDir;
    icon = os.platform() === 'win32' && 'menu@2x.png' || 'menu.png';
    tray = new Tray(path.join(__dirname, '..', 'img', icon));
    tray.on('click', toggleWindow);
    if ((ref1 = app.dock) != null) {
      ref1.hide();
    }
    app.setName(pkg.productName);
    if (args.show) {
      showWindow();
    }
    rootDir = prefs.get('rootDir', resolve('~/s'));
    startKonrad(rootDir);
    electron.globalShortcut.register(prefs.get('shortcut'), toggleWindow);
    if (os.platform() !== 'win32') {
      return Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
          label: app.getName(),
          submenu: [
            {
              label: "About " + pkg.name,
              accelerator: 'Command+.',
              click: showAbout
            }, {
              type: 'separator'
            }, {
              label: 'Set Dir...',
              accelerator: 'Command+o',
              click: setRootDir
            }, {
              label: 'Clear Log',
              accelerator: 'Command+K',
              click: function() {
                return win != null ? win.webContents.send('clearLog') : void 0;
              }
            }, {
              type: 'separator'
            }, {
              label: "Hide " + pkg.productName,
              accelerator: 'Cmd+H',
              role: 'hide'
            }, {
              label: 'Hide Others',
              accelerator: 'Cmd+Alt+H',
              role: 'hideothers'
            }, {
              type: 'separator'
            }, {
              label: 'Quit',
              accelerator: 'Command+Q',
              click: function() {
                return app.quit();
              }
            }
          ]
        }, {
          label: 'Window',
          submenu: [
            {
              label: 'Minimize',
              accelerator: 'Alt+Cmd+M',
              click: function() {
                return win != null ? win.minimize() : void 0;
              }
            }, {
              type: 'separator'
            }, {
              label: 'Close Window',
              accelerator: 'Cmd+W',
              click: function() {
                return win != null ? win.close() : void 0;
              }
            }, {
              type: 'separator'
            }, {
              label: 'Bring All to Front',
              accelerator: 'Alt+Cmd+`',
              click: function() {
                return win != null ? win.show() : void 0;
              }
            }, {
              type: 'separator'
            }, {
              label: 'Reload Window',
              accelerator: 'Ctrl+Alt+Cmd+L',
              click: function() {
                return win != null ? win.webContents.reloadIgnoringCache() : void 0;
              }
            }, {
              label: 'Toggle DevTools',
              accelerator: 'Cmd+Alt+I',
              click: function() {
                return win != null ? win.webContents.openDevTools() : void 0;
              }
            }
          ]
        }
      ]));
    } else {
      return Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
          label: app.getName(),
          submenu: [
            {
              label: "About " + pkg.name,
              accelerator: 'Ctrl+.',
              click: showAbout
            }, {
              type: 'separator'
            }, {
              label: 'Set Dir...',
              accelerator: 'Ctrl+o',
              click: setRootDir
            }, {
              label: 'Clear Log',
              accelerator: 'Ctrl+K',
              click: function() {
                return win != null ? win.webContents.send('clearLog') : void 0;
              }
            }, {
              type: 'separator'
            }, {
              label: 'Quit',
              accelerator: 'Ctrl+Q',
              click: function() {
                return app.quit();
              }
            }
          ]
        }, {
          label: 'Window',
          submenu: [
            {
              label: 'Minimize',
              accelerator: 'Ctrl+Alt+M',
              click: function() {
                return win != null ? win.minimize() : void 0;
              }
            }, {
              type: 'separator'
            }, {
              label: 'Close Window',
              accelerator: 'Ctrl+W',
              click: function() {
                return win != null ? win.close() : void 0;
              }
            }, {
              type: 'separator'
            }, {
              label: 'Reload Window',
              accelerator: 'Ctrl+Alt+L',
              click: function() {
                return win != null ? win.webContents.reloadIgnoringCache() : void 0;
              }
            }, {
              label: 'Toggle DevTools',
              accelerator: 'Ctrl+Alt+I',
              click: function() {
                return win != null ? win.webContents.openDevTools() : void 0;
              }
            }
          ]
        }
      ]));
    }
  });

  if (app.makeSingleInstance(function() {
    return showWindow();
  })) {
    app.quit();
  }

}).call(this);
