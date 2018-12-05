from collections import Counter
from operator import itemgetter
import preproc


def popular_channels(chans, limit=20):
    """Top channels, ordered by messages
    """
    top_channels = [(c['channel_info']['name'], len(c['messages'])) for c in chans]
    top_channels.sort(key=itemgetter(1), reverse=True)
    return top_channels[:limit]


def most_mentioned(msgs, limit=20):
    """Top mentions by '@' references
    """
    mentions = {}
    for m in msgs:
        for at in preproc.extract_ats_from_text(m['text']):
            mentions[at] = mentions[at] + 1 if at in mentions else 1
    return sorted(mentions.items(),
                  key=lambda x: x[1],
                  reverse=True)[:limit]


def top_senders(msgs, limit=20):
    """Highest number of messages sent
    """
    return Counter([m['user'] for m in msgs]).most_common(limit)


def top_shouters(msgs, limit=20):
    """Highest users of 'here', 'channel', 'everyone'
    """
    return Counter([m['user']
                    for m in msgs if preproc.extract_shouts_from_text(m['text'])]
                   ).most_common(limit)
