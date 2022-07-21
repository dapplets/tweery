import {} from '@dapplets/dapplet-extension';
import test_button_save_icon from './icons/test_dap_2.svg';
import test_button_get_icon from './icons/test_dap.svg';
import test from './icons/test_dap.png';
import ABI from './ABI';
import { Api } from './api';
import { IBridge, IStorage } from './types';
import { formatIsoToDate, waitProperty } from './helpers';

@Injectable
export default class TwitterFeature {
  @Inject('twitter-adapter.dapplet-base.eth')
  public adapter: any;

  private state = Core.state<IStorage>({
    likes: [],
    counter: 0,
    link: '',
    isActive: false,
    userAccount: '',
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
      PROFILE: async (profile) => {
        const customTweets = await this.api.fetchCustomTweets('lisofffa');
      console.log(customTweets);
      console.log(profile.authorUsername);
      this.api.addCustomTweet(profile.authorUsername, profile)
        return customTweets.map((x) =>
       
          post({
            initial: 'DEFAULT',
            DEFAULT: {
              text: x.text,
              authorFullname: profile.authorFullname,
              authorUsername: profile.authorUsername,
              authorImg: profile.authorImg,
              hidden:false
            },
            init: async (ctx, me) => {
              console.log(ctx);
            }
          }),
        );
      },
      POST: async (tweet) => {
        // backup and restore only quoted tweets
        if (!tweet.id || !tweet.quote) return;

        // backup quote tweets into ipfs
        if (!tweet.quote.isDeleted) {
          await waitProperty(tweet, 'authorImg', 5000);
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
              hidden:false
            },
          }),
        ];
      },
    });
  }
}
