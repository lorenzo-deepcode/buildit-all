import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Table from '/components/2-molecules/Table';
import { WithNotes } from '@kadira/storybook-addon-notes';
import '../../src/less/main.less';

const tableData = [
  { whiskey: 'row one', tango: 'row one', foxtrot: 'row one' },
  { whiskey: 'row two', tango: 'row two', foxtrot: 'row two' },
  { whiskey: 'row three', tango: 'row three', foxtrot: 'row three' },
];
const visibleColumns = ['whiskey', 'tango', 'foxtrot'];

storiesOf('molecules.Table', module)
  .add('Standard Table', () => (
    <WithNotes notes={'A table with a styled header row.'}>
      <Table
        tableData={tableData}
        visibleColumns={visibleColumns}
        rowKey="whiskey"
      />
    </WithNotes>
  ))
  .add('Stripped Table', () => (
    <WithNotes notes={'A table with a styled header row and alternating data rows stripped.'}>
      <Table
        tableData={tableData}
        visibleColumns={visibleColumns}
        rowKey="whiskey"
        isStriped="true"
      />
    </WithNotes>
  ));
