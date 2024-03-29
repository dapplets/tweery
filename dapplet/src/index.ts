import {} from '@dapplets/dapplet-extension';
import { Api } from './api';
import { IBridge, IStorage } from './types';
import { formatIsoToDate, waitProperty } from './helpers';

@Injectable
export default class TwitterFeature {
  @Inject('twitter-adapter.dapplet-base.eth')
  public adapter: any;

  private state = Core.state<IStorage>({
    userAccount: '',
    currentTwitterUsername: '',
  });

  private api = new Api({
    ipfsGateway: 'https://ipfs.kaleido.art',
    kvStorage: 'https://tweery.mooo.com',
    state: this.state,
  });

  private overlay = Core.overlay<IBridge>({ name: 'overlay', title: '/tweery' })
    .useState(this.state)
    .declare(this.api);

  async activate(): Promise<void> {
    Core.onAction(() => this.overlay.open());

    await this.api.initializeCurrentAccount();

    const { quote, post } = this.adapter.exports;

    this.adapter.attachConfig({
      events: {
        repost: (tweet, { disabled }) => {
          if (disabled) {
            this.overlay.open();
          }
        },
      },

      PROFILE: async (profile) => {
        const customTweets = await this.api.fetchCustomTweets(profile.authorUsername);
        this.state.global.currentTwitterUsername.next(profile.authorUsername);
        // this.api.clearCustomTweets(profile.authorUsername);
        return customTweets.reverse().map((x) => {
          if (!x) return;
          else
            return post({
              initial: 'DEFAULT',
              DEFAULT: {
                text: x.text,
                authorFullname: profile.authorFullname,
                authorUsername: profile.authorUsername,
                authorImg: profile.authorImg,
                color: { DARK: '#FFF', LIGHT: '#000' },
                hidden: false,
                date: x.date,
                time: x.time,
              },
            });
        });
      },
      POST: async (tweet) => {
        // backup and restore only quoted tweets
        if (!tweet.id || !tweet.quote) return;

        // backup quote tweets into ipfs
        if (!tweet.quote.isDeleted) {
          // wait lazy loaded images
          await new Promise((res) => setTimeout(res, 3000));
          await this.api.saveTweet(tweet);
          return;
        }

        // restore tweet from ipfs
        const restoredTweet = await this.api.fetchTweet(tweet.id);
        if (!restoredTweet || !restoredTweet.quote) return;

        return [
          quote({
            initial: 'DEFAULT',
            DEFAULT: {
              replace: 'This Tweet was deleted by the Tweet author',
              date: formatIsoToDate(restoredTweet.quote.createdAt),
              authorUsername: restoredTweet.quote.authorUsername,
              authorFullname: restoredTweet.quote.authorFullname,
              authorImg: restoredTweet.quote.authorImg,
              text: restoredTweet.quote.text,
              img: restoredTweet.quote.img,
              color: { DARK: '#FFF', LIGHT: '#000' },
              hidden: false,
            },
          }),
        ];
      },
    });
  }
}
