import {} from '@dapplets/dapplet-extension';
import test_button_save_icon from './icons/test_dap_2.svg';
import test_button_get_icon from './icons/test_dap.svg';
import test from './icons/test_dap.png';
import ABI from './ABI';
import { Api } from './api';
import { IBridge, IStorage } from './types';

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

    const { text } = this.adapter.exports;

    this.adapter.attachConfig({
      POST: async (tweet) => {
        if (!tweet.id || !tweet.el) return;

        const isDeletedTweet = tweet.el.innerHTML.includes('This Tweet was deleted');

        // backup tweet into ipfs
        if (!isDeletedTweet) {
          await this.api.saveTweet(tweet);
          return;
        }

        // restore tweet from ipfs
        const restoredTweet = await this.api.fetchTweet(tweet.id);
        if (!restoredTweet) return;

        return [
          text({
            initial: 'DEFAULT',
            DEFAULT: {
              hidden: false,
              text: '',
              replace: 'This Tweet was deleted by the Tweet author',
              img: null,
              innerText: restoredTweet.innerTextRetweet,
              imgRetweet: restoredTweet.imgRetweet,
            },
          }),
        ];
      },
    });
  }
}
