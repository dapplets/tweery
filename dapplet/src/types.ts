export interface IStorage {
  likes: string[];
  counter: number;
  link: string;
  isActive: boolean;
  userAccount: string;
}

export interface ICustomTweet {
  authorFullname: string;
  authorUsername: string;
  authorHash?: string;
  id: string;
  time: string;
  date: string;
  text: string;
}

export interface IBridge {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addCustomTweet: (authorUsername: string, tweet: ICustomTweet) => Promise<void>;
  fetchCustomTweets: (authorUsername: string) => Promise<ICustomTweet[]>;
}
