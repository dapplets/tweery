import React, { FC, useEffect, useState, useMemo } from 'react';
import {} from '@dapplets/dapplet-extension';
// import { bridge } from './dappletBridge';
import Bridge, { IDappStateProps, dappletState } from '@dapplets/dapplet-overlay-bridge';
import { Login } from './components/Login';
import styles from './App.module.scss';
import cn from 'classnames';

interface IStorage {
  likes: string[];
  counter: number;
  link: string;
  userAccount: string;
  currentTwitterUsername: string;
}
export interface ICustomTweet {
  authorHash?: string;
  id: string;
  time: string;
  date: string;
  text: string;
}
interface IBridge {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addCustomTweet: (authorUsername: string, ICustomTweet: ICustomTweet) => Promise<void>;
  fetchCustomTweets(authorUsername: string): Promise<ICustomTweet[]>;
}

const App = (props: IDappStateProps<IStorage>) => {
  const { sharedState } = props;
  const bridge = new Bridge<IBridge>();
  const [isWaiting, setIsWaiting] = useState(false);
  const [cusomTweets, setCustomTweets] = useState<ICustomTweet[]>();
  const userName = sharedState.global?.currentTwitterUsername;

  useEffect(() => {
    const init = async () => {
      if (!userName) {
        return;
      }
      await bridge.fetchCustomTweets(userName).then((x) => setCustomTweets(x));
    };
    init();
    return () => {};
  }, [userName]);

  const handleLogIn = async (e: any) => {
    e.preventDefault();
    setIsWaiting(true);
    const res = await bridge.login();
    setIsWaiting(false);
  };

  const handleLogOut = async (e: any) => {
    e.preventDefault();
    setIsWaiting(true);
    const res = await bridge.logout();
    setIsWaiting(false);
  };
  const addTweet = async (e: any, newTweet: any) => {
    e.preventDefault();
    if (!newTweet) return;

    setIsWaiting(true);
    const res = await bridge.addCustomTweet(userName, newTweet);
    setIsWaiting(false);
  };
  const getTweet = async () => {
    setIsWaiting(true);
    const res = await bridge.fetchCustomTweets(userName);

    setIsWaiting(false);

    return res;
  };

  return (
    sharedState && (
      <div className={styles.wrapper}>
        <Login
          name={sharedState.global?.userAccount}
          message="// Imagine a world where
        all deleted tweets can be recovered...
        And much more //"
          login={handleLogIn}
          logout={handleLogOut}
          disabled={isWaiting}
          loading={isWaiting}
          addCustomTweet={addTweet}
          fetchCustomTweets={getTweet}
          cusomTweets={cusomTweets}
        />
      </div>
    )
  );
};

export default App;
