import { IpfsStorage } from './ipfsStorage';
import { KeyValueStorage } from './kvStorage';
import { IBridge, ICustomTweet } from './types';

export class Api implements IBridge {
  private ipfsStorage: IpfsStorage;
  private kvStorage: KeyValueStorage;
  private state: any;

  constructor(config: { ipfsGateway: string; kvStorage: string; state: any }) {
    this.ipfsStorage = new IpfsStorage(config.ipfsGateway);
    this.kvStorage = new KeyValueStorage(config.kvStorage);
    this.state = config.state;
  }

  async initializeCurrentAccount(): Promise<void> {
    const prevSessions = await Core.sessions();
    const prevSession = prevSessions.find((x) => x.authMethod === 'ethereum/goerli');

    if (prevSession) {
      const wallet = await prevSession.wallet();
      const accountIds = await wallet.request({ method: 'eth_accounts', params: [] });
      this.state.global.userAccount.next(accountIds[0]);
    }
  }

  async login(): Promise<void> {
    try {
      const prevSessions = await Core.sessions();
      const prevSession = prevSessions.find((x) => x.authMethod === 'ethereum/goerli');
      let session = prevSession ?? (await Core.login({ authMethods: ['ethereum/goerli'] }));
      let wallet = await session.wallet();
      if (!wallet) {
        session = await Core.login({ authMethods: ['ethereum/goerli'] });
        wallet = await session.wallet();
      }

      const accountIds = await wallet.request({ method: 'eth_accounts', params: [] });
      this.state.global.userAccount.next(accountIds[0]);
      // changeIsActiveStates(state);
    } catch (err) {
      console.log('Login was denied', err);
    }
  }

  async logout(): Promise<void> {
    const sessions = await Core.sessions();
    sessions.forEach((x) => x.logout());
    this.state.global.userAccount.next('');

    // changeIsActiveStates(state);
  }

  async saveTweet(tweet: any): Promise<void> {
    // ToDo: save significant properties only
    const cid = await this.ipfsStorage.saveObject(tweet);
    await this.kvStorage.set(`tweet/${tweet.id}`, cid);
  }

  async fetchTweet(tweetId: string): Promise<any> {
    try {
      const cid = await this.kvStorage.get(`tweet/${tweetId}`);
      if (!cid) return null;
      const tweet = await this.ipfsStorage.fetchObject(cid);
      return tweet;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async addCustomTweet(authorUsername: string, tweet: ICustomTweet): Promise<void> {
    const newTweetCid = await this.ipfsStorage.saveObject(tweet);
    const existingCids = await this.kvStorage.get(`profile/${authorUsername}`) ?? [];
    const newCids = [...existingCids, newTweetCid];
    await this.kvStorage.set(`profile/${authorUsername}`, newCids);
  }

  async fetchCustomTweets(authorUsername: string): Promise<ICustomTweet[]> {
    const cids = await this.kvStorage.get(`profile/${authorUsername}`) ?? [];
    return Promise.all(cids.map(x => this.ipfsStorage.fetchObject(x)));
  }
  async clearCustomTweets(authorUsername: string):Promise<void>{
    await this.kvStorage.set(`profile/${authorUsername}`, []);
  }
}
