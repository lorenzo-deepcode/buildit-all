import re


def default_msgs_filter(m):
    return not m.get('is_intro') and not m.get('subtype')


def messages_from_channels(chans, msgs_filter=default_msgs_filter, fragment_interval_sec=300):
    res = []

    for c in chans:
        #last_chan_msg_ts = -1
        #buf = None
        for msg in c['messages']:
            if not msgs_filter(msg):
                continue
            # if not buf
            #                     or buf['user'] != msg['user'] or msg['':
            #                 res.append(msg.copy())
            #                 buf = res[-1]
            #             else:

            res.append(msg)
    return res


def iter_interactions(msgs):
    """
    :param msgs:
    :return:
    """

    # TODO: track last n messages we see, infer interaction
    #   from a 'chatty' conversation - e.g. recents = deque([], 3) etc

    for m in sorted(msgs, key=lambda x: x['ts']):
        def make_event(src, tgt, typ):
            return {u'src': src,
                    u'tgt': tgt,
                    u'ts': m['ts'],
                    u'dt': m['dt'],
                    u'ch_id': m['ch_id'],
                    u'type': typ}

        # count ats ("@')
        for at in extract_ats_from_text(m['text']):
            yield make_event(m['user'], at, 'at')

        # count reactions
        for r in m.get('reactions') or []:
            # r['name'] is the reaction, e.g. +1
            # note reactions don't carry a timestamp, so we use the one from the message
            for user in r['users']:
                yield make_event(user, m['user'], 'reaction')

        # explicit replies
        for r in m.get('replies') or []:
            yield make_event(r['user'], m['user'], 'reply')


def slack_ts_str_to_epoch_sec(ts_str):
    assert type(ts_str == 'str')
    return int(ts_str.split('.')[0])


at_re = re.compile(r'<@(\w+)>')
shout_re = re.compile(r'<!(here|channel|everyone)')


def extract_ats_from_text(text):
    return [m.group(1) for m in at_re.finditer(text)]


def extract_shouts_from_text(text):
    return [m.group(1) for m in shout_re.finditer(text)]

