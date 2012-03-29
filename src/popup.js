window.addEventListener('load', function() {
  var config, main, left, handler;

  config = {};
  config.set = function(key, value) {
    localStorage['config_' + key] = value;
  };
  config.get = function(key) {
    return localStorage['config_' + key];
  };

  main = document.getElementById('main');
  left = document.getElementById('left');

  chrome.bookmarks.getTree(function(res) {
    var key, node, a, img;

    for (key = 0; node = res[0].children[0].children[key]; key++) {
      if ('url' in node) {

        a = document.createElement('a');
        a.href = node.url;
        a.title = node.title;

        img = document.createElement('img');
        img.src = 'chrome://favicon/' + node.url;
        a.appendChild(img);

        left.appendChild(a);
      }
    }
  });

  handler = function(e) {
    var url, cb;

    url = e.target.href || e.target.parentNode.href;

    if (url === undefined) {
      return;
    }

    e.preventDefault();

    cb = function() {
      close();
    };
    chrome.windows.getCurrent(function(window) {
      chrome.tabs.getSelected(window.id, function(tab) {
        if (
            (config.get('always_open_in_new_tab') === 'on') ||
            (e.which === 1 && e.ctrlKey) ||
            (e.which === 2)
        ) {
          chrome.tabs.create({
            url: url,
            index: tab.index + 1,
            /* selected : e.shiftKey */
            selected: true
          }, cb);
        }
        else if (e.which === 1 && !e.shiftKey && !e.ctrlKey) {
          chrome.tabs.update(tab.id, {url: url}, cb);
        }
        else if (e.which === 1 && e.shiftKey && !e.ctrlKey) {
          chrome.windows.create({url: url}, cb);
        }
      });
    });
  };

  main.addEventListener('click', function (e) {
    if (e.which === 2) {
      e.preventDefault();
    }
    else {
      handler(e);
    }
  }, false);

  (function() {
    var target;

    main.addEventListener('mousedown', function(e) {
      if (e.which === 2) {
        target = e.target;
      }
    }, false);

    main.addEventListener('mouseup', function(e) {
      if (e.which === 2) {
        if (e.target === target) {
          main.removeEventListener('click', handler, false);
          handler({
            which: e.which,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            target: e.target,
            preventDefault: function() { null; }
          });
        }
        target = null;
      }
    }, false);
  })();
}, false);
