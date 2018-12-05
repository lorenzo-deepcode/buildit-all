import React from 'react';
import { storiesOf, action, linkTo } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import Button from './Button';

storiesOf('Button/Simple', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ))
  .addWithInfo(
    'simple usage',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (
      <div>
        <Button onClick={action('clicked')}>Hello Button</Button>
        <br />
        <p>
          Click the "?" mark at top-right to view the info.
        </p>
      </div>
    )
  );
storiesOf('Button/WithUsage', module)
  .addWithInfo(
    'simple usage (inline info)',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (<Button onClick={action('onClick')}>Hello Button</Button>),
    { inline: true },
  )
  .addWithInfo(
    'simple usage (disable source)',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (<Button onClick={action('onClick')}>Hello Button</Button>),
    { source: false, inline: true },
  )
  .addWithInfo(
    'simple usage (no header)',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (<Button onClick={action('onClick')}>{text('Label', 'Hello Button')}</Button>),
    { header: false, inline: true },
  )
  .addWithInfo(
    'simple usage (no prop tables)',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (<Button onClick={action('onClick')}>{text('Label', 'Hello Button')}</Button>),
    { propTables: false, inline: true },
  )
  .addWithInfo(
    'simple usage (custom propTables)',
    `
      This is the basic usage with the button with providing a label to show the text.

      Since, the story source code is wrapped inside a div, info addon can't figure out propTypes on it's own.
      So, we need to give relevant React component classes manually using \`propTypes\` option as shown below:

      ~~~js
      storiesOf('Button')
        .addWithInfo(
          'simple usage (custom propTables)',
          <info>,
          <storyFn>,
          { inline: true, propTables: [Button]}
        );
      ~~~
    `,
    () => (
      <div>
        <Button onClick={action('onClick')}>{text('Label', 'Hello Button')}</Button>
        <br />
      </div>
    ),
    { inline: true, propTables: [Button]}
  );
storiesOf('Button/WithJSX', module)
  .addWithInfo(
    'simple usage (JSX description)',
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
      <div>
        <Button onClick={action('onClick')}>{text('Label', 'Hello Button')}</Button>
        <br />
        <p>
          Click the "?" mark at top-right to view the info.
        </p>
      </div>
    ),
  )
  .addWithInfo(
    'simple usage (inline JSX description)',
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
    () => (<Button onClick={action('onClick')}>{text('Label', 'Hello Button')}</Button>),
    { inline: true }
  );

