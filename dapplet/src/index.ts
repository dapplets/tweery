import {} from '@dapplets/dapplet-extension';
import test_button_save_icon from './icons/test_dap_2.svg';
import test_button_get_icon from './icons/test_dap.svg';
import test from './icons/test_dap.png';
import ABI from './ABI';
import { Api } from './api';
import { IBridge, IStorage } from './types';
import { formatIsoToDate } from './helpers';

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
    console.log('this.api', this.api);

    Core.onAction(() => this.overlay.open());

    await this.api.initializeCurrentAccount();

    const { text, post } = this.adapter.exports;

    this.adapter.attachConfig({
      PROFILE: async (profile) => {
        const customTweets = await this.api.fetchCustomTweets(profile.authorUsername);
        return customTweets.map((x) =>
          post({
            initial: 'DEFAULT',
            DEFAULT: {
              text: x.text,
              authorFullname: profile.authorFullname,
              authorUsername: profile.authorUsername,
              authorImg: profile.authorImg,
            },
          }),
        );
      },
      POST: async (tweet) => {
        if (!tweet.id || !tweet.el) return;

        const html = tweet.el.innerHTML;
        const isDeletedTweet =
          html.includes('This Tweet was deleted') || html.includes('This Tweet is unavailable');

        // backup tweet into ipfs
        if (!isDeletedTweet) {
          await this.api.saveTweet(tweet);
          return;
        }

        // restore tweet from ipfs
        const restoredTweet = await this.api.fetchTweet(tweet.id);
        if (!restoredTweet) return;
        console.log(restoredTweet);
        console.log(isDeletedTweet);

        return [
          text({
            initial: 'DEFAULT',
            DEFAULT: {
              text: '',
              color: { DARK: '#FFF', LIGHT: '#000' },
              replace: 'This Tweet was deleted by the Tweet author',
              retweetDate: formatIsoToDate(restoredTweet.idRetweetTime),
              authorRetweetUserName: restoredTweet.authorRetweetUserName,
              authorRetweetName: restoredTweet.authorRetweet,
              authorRetweetImage: restoredTweet.authorRetweetImg,
              innerText: restoredTweet.innerTextRetweet,
              imgRetweet: restoredTweet.imgRetweet,
              hidden: false
            },
          }),
        ];
      },
    });
  }
}
