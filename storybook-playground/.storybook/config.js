import { configure, setAddon, addDecorator } from '@storybook/react';
import addWithInfo from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'Storybook playground',
  url: 'https://github.com/buildit/storybook-playground',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: false,
  sortStoriesByKind: false,
  hierarchySeparator: '\\/|\\.|¯\\\\_\\(ツ\\)_\\/¯'
});

setAddon(addWithInfo);

addDecorator(withKnobs);

function loadStories() {
  require('../stories/story');
}

configure(loadStories, module);
