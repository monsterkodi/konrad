(function() {
  var $, _, childp, clearLog, clearTasks, electron, ipc, keyinfo, log, moment, onError, onMessage, onTask, openFile, prefs, ref, resolve, scheme, setTitleBar, taskDiv, tasks, unresolve;

  ref = require('kxk'), unresolve = ref.unresolve, resolve = ref.resolve, keyinfo = ref.keyinfo, scheme = ref.scheme, prefs = ref.prefs, log = ref.log, $ = ref.$, _ = ref._;

  childp = require('child_process');

  electron = require('electron');

  moment = require('moment');

  ipc = electron.ipcRenderer;

  prefs.init();

  scheme.set(prefs.get('scheme', 'dark'));

  window.onresize = function() {
    return ipc.send('saveBounds');
  };

  openFile = function(f) {
    f = resolve(f);
    return childp.spawn('/usr/local/bin/ko', [f]);
  };

  tasks = {};

  clearLog = function() {
    return $("main").innerHTML = "<img class='info' src='" + __dirname + "/../img/about.png'>";
  };

  clearTasks = function() {
    clearLog();
    return tasks = {};
  };

  ipc.on("clearLog", clearLog);

  ipc.on("konradExit", function(event, s) {});

  ipc.on("konradError", function(event, s) {});

  ipc.on("konradVersion", function(event, s) {
    return setTitleBar(s);
  });

  ipc.on("konradOutput", function(event, s) {
    if (/ 😡 /.test(s)) {
      return onError(s);
    } else if (/ 👍 /.test(s)) {
      return onTask(s);
    } else if (/ 🔧 /.test(s)) {
      return onMessage(s);
    } else {
      return console.log('konrad', s);
    }
  });

  taskDiv = function(opt) {
    var div, fil, main, ref1, ref2, tim;
    main = $('main');
    if (_.isEmpty(tasks)) {
      main.innerHTML = '';
    }
    if ((ref1 = tasks[opt.key]) != null) {
      ref1.remove();
    }
    div = document.createElement('div');
    tim = document.createElement('span');
    fil = document.createElement('span');
    div.classList.add('task');
    tim.classList.add('time');
    tim.innerHTML = opt.time;
    fil.classList.add((opt.file != null) && 'file' || 'message');
    fil.innerHTML = " " + opt.icon + " " + ((ref2 = opt.file) != null ? ref2 : opt.message);
    fil.onclick = function() {
      if (opt.file != null) {
        return openFile(opt.file);
      }
    };
    div.appendChild(tim);
    div.appendChild(fil);
    tasks[opt.key] = div;
    main.appendChild(div);
    return div;
  };

  onTask = function(s) {
    var div, ref1, ref2, source, sourceTarget, target, time;
    ipc.send('highlight');
    ref1 = s.split(' 👍 '), time = ref1[0], sourceTarget = ref1[1];
    ref2 = sourceTarget.split(' ► '), source = ref2[0], target = ref2[1];
    source = source.trim();
    div = taskDiv({
      time: time,
      file: source,
      key: source,
      icon: '👍'
    });
    return div.scrollIntoViewIfNeeded();
  };

  onMessage = function(s) {
    var div, msg, ref1, time;
    ref1 = s.split(' 🔧 '), time = ref1[0], msg = ref1[1];
    return div = taskDiv({
      time: time,
      message: msg,
      key: 'msg',
      icon: '🔧'
    });
  };

  onError = function(s) {
    var div, file, i, l, len, lines, pre, ref1, time;
    ipc.send('showWin');
    ipc.send('highlight');
    clearTasks();
    lines = s.split('\n');
    ref1 = lines.shift().split(' 😡 '), time = ref1[0], file = ref1[1];
    file = file.trim();
    div = taskDiv({
      time: time,
      file: file,
      key: file.split(':')[0],
      icon: '😡'
    });
    for (i = 0, len = lines.length; i < len; i++) {
      l = lines[i];
      pre = document.createElement('pre');
      pre.classList.add('error');
      pre.textContent = l;
      div.appendChild(pre);
    }
    return div.scrollIntoViewIfNeeded();
  };

  setTitleBar = function(s) {
    var html, path, ref1, version;
    ref1 = s.split(' ● '), path = ref1[0], version = ref1[1];
    html = "<span class='titlebarPath'>" + (unresolve(path)) + "</span>";
    html += "<span class='titlebarDot'> ● </span>";
    html += "<span class='titlebarVersion'>" + version + "</span>";
    $('titlebar').innerHTML = html;
    return $('titlebar').ondblclick = (function(_this) {
      return function() {
        return ipc.send('toggleMaximize');
      };
    })(this);
  };

  document.onkeydown = function(event) {
    var combo, key, mod, ref1;
    ref1 = keyinfo.forEvent(event), mod = ref1.mod, key = ref1.key, combo = ref1.combo;
    switch (combo) {
      case 'k':
        return clearTasks();
      case 'esc':
      case 'w':
        return window.close();
      case 'command+i':
      case 'i':
        return scheme.toggle();
      case 'command+c':
        return document.execCommand('copy');
      case 'command+alt+i':
        return ipc.send('openDevTools');
      case 'command+alt+ctrl+l':
        return ipc.send('reloadWin');
    }
  };

}).call(this);
