const container = document.querySelector('#mynetwork');
const sliderValue = document.querySelector('#slider-value');
const messageCountSlider = document.querySelector('#message-count');

const graphOptions = {
  layout: {
    randomSeed: undefined,
    improvedLayout: true,
    hierarchical: {
      enabled: false,
      levelSeparation: 300,
      nodeSpacing: 200,
      treeSpacing: 400,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'UD',        // UD, DU, LR, RL
      sortMethod: 'hubsize'   // hubsize, directed
    }
  },

  physics: {
    enabled: true
  },

  nodes: {
    shape: 'circle'
  },

  edges: {
    arrows: {
      to: {
        enabled: true
      },

      from: {
        enabled: true
      }
    }
  }
};

const drawGraph = (nodes, edges) => {
  const network = new vis.Network(container, { nodes, edges }, graphOptions);
};

const fetchResult = url => {
  const options =  {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cache': 'no-cache'
    },
    credentials: 'include'
  };

  return fetch(url, options)
}

const loadUsers = () => {
  return fetchResult('/files/metadata.json')
    .then(res => res.json())
    .then(json => json.users);
};

const filterParticipants = (users, edges) => {
  const participantIds = edges.reduce(
    (acc, e) => [...acc, e.s, e.t],
    []
  );

  return users.filter(u => participantIds.includes(u.id))
};

const getUserList = users => {
  const nodes = [];
  for(id in users) {
    if(users.hasOwnProperty(id)) {
      nodes.push({ id, label: users[id]});
    }
  }

  return nodes;
};

const loadBuildItInteractions = size => {
  return fetchResult('/files/results/weighted.json')
    .then(res => res.json())
    .then(edges => edges.filter(e => e.count > size))
};

const createEgdes = connectionList => {
  return new vis.DataSet(
    connectionList
    .reduce(
      (acc, c) => {
        acc.push({ from: c['s'], to: c['t'] })
        return acc;
      },
      []
    )
  );
};

const userNodesCreated = (users, size) => {
  loadBuildItInteractions(size)
    .then(edges => {
      drawGraph(
        new vis.DataSet(filterParticipants(getUserList(users), edges)),
        createEgdes(edges)
      )
    });
};

const start = () => {
  loadUsers()
    .then(users => {
      const onSliderChange = () => {
        sliderValue.innerHTML = messageCountSlider.value;
        userNodesCreated(users, messageCountSlider.value)
      };

      const addEventListeners = () => {
        messageCountSlider.addEventListener('change', onSliderChange);
      };

      addEventListeners();

      return users;
    })
    .then(users => userNodesCreated(users, 10));
};

start();
