window.addEventListener('load', function() {
  var config, node, nodes, key;

  config = {};
  config.set = function(key, value) {
    localStorage['config_' + key] = value;
  };
  config.get = function(key) {
    return localStorage['config_' + key];
  };

  nodes = document.querySelectorAll('input[type="checkbox"]');
  for (key = 0; node = nodes[key]; key++) {
    node.checked = (config.get(node.name) === 'on');
  }

  document.documentElement.addEventListener('change', function(e) {
    if (e.target.webkitMatchesSelector('input[type="checkbox"]')) {
      config.set(e.target.name, e.target.checked ? 'on' : 'off');
    }
  }, false);
}, false);
