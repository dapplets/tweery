import {} from '@dapplets/dapplet-extension';
import test_button_save_icon from './icons/test_dap_2.svg';
import test_button_get_icon from './icons/test_dap.svg';
import test from './icons/test_dap.png';
import ABI from './ABI';

interface IStorage {
  likes: string[];
  counter: number;
  link: string;
  isActive: boolean;
  userAccount: string;
}
interface ICustomTweet {
  authorFullname: string;
  authorUsername: string;
  authorHash?: string;
  id: string;
  time: string;
  date: string;
  text: string;
}
interface IBridge {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addCustomTweet: (ICustomTweet: ICustomTweet) => any;
}
@Injectable
export default class TwitterFeature {
  @Inject('twitter-adapter.dapplet-base.eth')
  public adapter: any;

  async activate(): Promise<void> {
    const state = Core.state<IStorage>({
      likes: [],
      counter: 0,
      link: '',
      isActive: false,
      userAccount: '',
    });

    const prevSessions = await Core.sessions();
    const ipfsGateway = 'https://ipfs.kaleido.art';

    const prevSession = prevSessions.find((x) => x.authMethod === 'ethereum/goerli');
    if (prevSession) {
      const wallet = await prevSession.wallet();

      const accountIds = await wallet.request({ method: 'eth_accounts', params: [] });
      state.global.userAccount.next(accountIds[0]);
    }

    const overlay = Core.overlay<IBridge>({ name: 'overlay', title: '/tweery' })
      .useState(state)
      .declare({
        login: async () => {
          try {
            let session =
              prevSession ??
              (await Core.login({ authMethods: ['ethereum/goerli'], target: overlay }));
            let wallet = await session.wallet();
            if (!wallet) {
              session = await Core.login({ authMethods: ['ethereum/goerli'], target: overlay });
              wallet = await session.wallet();
            }

            const accountIds = await wallet.request({ method: 'eth_accounts', params: [] });
            state.global.userAccount.next(accountIds[0]);
            // changeIsActiveStates(state);
          } catch (err) {
            console.log('Login was denied', err);
          }
        },
        logout: async () => {
          const sessions = await Core.sessions();
          sessions.forEach((x) => x.logout());
          state.global.userAccount.next('');

          // changeIsActiveStates(state);
        },
        addCustomTweet: async (ICustomTweet: ICustomTweet) => {
          const getTweet = JSON.stringify(ICustomTweet);
          const json = JSON.stringify(getTweet);

          const blob = new Blob([json]);

          const response = await fetch('https://ipfs.kaleido.art/ipfs/', {
            method: 'POST',
            body: blob,
          });

          const cid = response.headers.get('ipfs-hash');
          const resp2 = await fetch('https://ipfs.kaleido.art/ipfs/' + cid);

          const json2 = await resp2.text();
          const tweet2 = JSON.parse(json2);
          const tweetObj = JSON.parse(tweet2);

          console.log(tweetObj, 'tweetObj');
        },
      });

    Core.onAction(() => overlay.open());

    const { text } = this.adapter.exports;
    let userParams;

    const Visible = async (target, me) => {
      const targetPosition = {
          top: window.pageYOffset + target.el.getBoundingClientRect().top,
          bottom: window.pageYOffset + target.el.getBoundingClientRect().bottom,
        },
        windowPosition = {
          top: window.pageYOffset,
          bottom: window.pageYOffset + document.documentElement.clientHeight,
        };

      if (
        targetPosition.bottom > windowPosition.top &&
        targetPosition.top < windowPosition.bottom
      ) {
        const newTweet = JSON.parse(localStorage.getItem(target.id));
        if (newTweet === null) {
          localStorage.setItem(target.id, JSON.stringify(target));
        }

        const getTweet = localStorage.getItem(target.id);

        const json = JSON.stringify(getTweet);

        const blob = new Blob([json]);

        const response = await fetch('https://ipfs.kaleido.art/ipfs/', {
          method: 'POST',
          body: blob,
        });

        const cid = response.headers.get('ipfs-hash');

        const resp2 = await fetch('https://ipfs.kaleido.art/ipfs/' + cid);
        const json2 = await resp2.text();
        const tweet2 = JSON.parse(json2);
        const tweetObj = JSON.parse(tweet2);

        if (!tweetObj) {
          return;
        }
        if (tweetObj.id === target.id) {
          userParams = tweetObj;
          userParams['cidRetweet'] = cid;
          console.log(userParams);
          const newTime = new Date(userParams.idRetweetTime);
          const res = [
            addLeadZero(newTime.getDate()),
            addLeadZero(newTime.getMonth() + 1),
            newTime.getFullYear(),
          ].join('.');

          function addLeadZero(val) {
            if (+val < 10) return '0' + val;
            return val;
          }
          me.replace = 'This Tweet was deleted by the Tweet author';

          me.retweetDate = res;
          me.authorRetweetUserName = userParams.authorRetweetUserName;
          me.authorRetweetName = userParams.authorRetweet;
          me.authorRetweetImage = userParams.authorRetweetImg;
          me.innerText = userParams.innerTextRetweet;
          me.img = userParams.imgRetweet;
          me.hidden = false;
        }
      } else {
        return;
      }
    };

    this.adapter.attachConfig({
      POST: async (ctx) => [
        text({
          initial: 'DEFAULT',
          DEFAULT: {
            hidden: true,
            text: '',
            replace: 'This Tweet was deleted by the Tweet author',
            img: null,
            innerText: '',
            authorRetweetImage: null,
            authorRetweetName: null,
            authorRetweetUserName: null,
            retweetDate: null,
            init: async (ctx, me) => {
              document.addEventListener('scroll', function () {
                Visible(ctx, me);
              });
            },

            exec: async (ctx, me) => {},
          },
        }),
      ],
    });
  }
}
// const changeIsActiveStates = (state: any) => {
//   const commentsInState = state.getAll();
//   delete commentsInState.global;
//   const currentAccount = state.global.userAccount.value.toLowerCase();
//   Object.entries(commentsInState).forEach(
//     ([id, commentData]: [id: string, commentData: IStorage]) => {
//       if (
//         commentData.likes.map((x) => x.toLowerCase()).includes(currentAccount) !==
//         commentData.isActive
//       ) {
//         state[id].isActive.next(!commentData.isActive);
//       }
//     },
//   );
// };
