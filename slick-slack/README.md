SlickSlack
======================================

A library for extraction and processing of Slack data.

### Extract Slack history

Based on https://gist.github.com/Chandler/fb7a070f52883849de35.

Get a slack token from https://api.slack.com/web

Unlike direct exports via Slack UI, this one uses the API to pull in public and private channels,
even direct messages if desired.

To run (and extract history in the current directory):

```
python -m slickslack.extract --token='123token' [--dryRun=True] [--skipDirectMessages] [--skipPrivateChannels]

```

### Parse extracted Slack history

```
import slickslack as sl
export_root='.'
users = sl.load_user_dict(export_root)
chans = sl.load_channels(export_root, includes=['myprefix*', '*myinfix*', 'w?ldc"rd'])
```

### Get / filter messages:

```
msgs = sum([], [m for c in chans
             for m in c['messages']
             if not m.get('is_intro') and not m.get('subtype')])
```

### Time series of interactions between users

Currently this comes from 1) '@' references, and 2) emoji reactions

```
for e in sl.iter_connections(msgs):
    # do stuff
```
