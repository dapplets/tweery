import {} from '@dapplets/dapplet-extension';
import test_button_save_icon from './icons/test_dap_2.svg';
import test_button_get_icon from './icons/test_dap.svg';
import test from './icons/test_dap.png'
import ABI from './ABI';

interface IStorage {
  likes: string[];
  counter: number;
  link: string;
  isActive: boolean;
  userAccount: string;
}
interface IBridge {
  login: () => Promise<void>;
  logout: () => Promise<void>;
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
      });

    Core.onAction(() => overlay.open());

    const { box, button , text, } = this.adapter.exports;
  
  
    const Visible = function (target) {

      const targetPosition = {
          top: window.pageYOffset + target.el.getBoundingClientRect().top,
          bottom: window.pageYOffset + target.el.getBoundingClientRect().bottom
        },

        windowPosition = {
          top: window.pageYOffset,
          bottom: window.pageYOffset + document.documentElement.clientHeight
        };
    
      if (targetPosition.bottom > windowPosition.top && 
        targetPosition.top < windowPosition.bottom ) { 
       
        localStorage.setItem(target.id, JSON.stringify(target));
      
        const getTweet = JSON.parse(localStorage.getItem(target.id))
        
      } else {
    return
     
      };
    };
  
    this.adapter.attachConfig({
      POST: async (ctx) => [
        box({
          initial: 'DEFAULT',
          DEFAULT: {
            width: '60%',
            hidden: true,
           
            position: 'bottom',
            text: '',
            init: async (ctx, me) => {
            
              const Tweet = ctx;
              if (Tweet.el.innerText.includes('his Tweet was deleted by the Tweet author. Learn more')){
              
                console.log(Tweet);
               
              }else{
                return
              }
              document.addEventListener('scroll', function() {
                Visible (ctx);
              });
              return function () {
                document.removeEventListener('scroll', function() {
                  Visible (ctx);
                });
              };
            

            },
            exec: async (ctx, me) => {
             
            },
          },
        }),
        // text({
        //   initial: 'DEFAULT',
        //   DEFAULT: {
        //     hidden: true,
        //     text: '',
        //     init: async (ctx, me) => {
            
        //       const Tweet = ctx;
        //       if (Tweet.el.innerText.includes('his Tweet was deleted by the Tweet author. Learn more')){
              
        //         console.log(Tweet);
               
        //       }else{
        //         return
        //       }
        //       document.addEventListener('scroll', function() {
        //         Visible (ctx);
        //       });
        //       return function () {
        //         document.removeEventListener('scroll', function() {
        //           Visible (ctx);
        //         });
        //       };
            

        //     },
        //     exec: async (ctx, me) => {
             
        //     },
        //   },
        // }),
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
