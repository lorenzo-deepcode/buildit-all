import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import { Footer } from '../src';

storiesOf('Organisms', module)
  .addWithInfo(
    'page footer',
    (<div>
        <h2>This is a JSX info section</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ornare massa rutrum metus commodo, a mattis velit dignissim.
            Fusce vestibulum turpis sed massa egestas pharetra. Sed at libero
            nulla.</p>
        <p>
            <a
                href='https://github.com/'>
            This is a link</a>
        </p>
        <p>
            <img src="http://placehold.it/350x150" />
        </p>
    </div>),
    () => (
      <Footer>{text('Footer text', 'This is a footer')}</Footer>
    ),
  );
