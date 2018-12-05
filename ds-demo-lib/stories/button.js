import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import { Button } from '../src';

storiesOf('Atoms', module)
  .addWithInfo(
    'button link',
    (<div>
        <h2>This is a button</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ornare massa rutrum metus commodo, a mattis velit dignissim.
            Fusce vestibulum turpis sed massa egestas pharetra. Sed at libero
            nulla.</p>
        <p>
            This lovely button was brought to you via:
            <ul>
              <li>
                <a href='#'>Link 1</a>
              </li>
              <li>
                <a href='#'>Link 2</a>
              </li>
              <li>
                <a href='#'>Link 3</a>
              </li>
            </ul>
        </p>
    </div>),
    () => (
      <Button href={text('Button href', '#')}>
        {text('Button text', 'Click me!')}
      </Button>
    )
  );
