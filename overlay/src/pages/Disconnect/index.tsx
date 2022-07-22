import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './Disconnect.module.scss';
import cn from 'classnames';
import anime from 'animejs';
import { ICustomTweet } from '../../App';
export interface DisconnectProps {
  avatar?: string;
  name: string;
  onLogout?: (e: any) => Promise<void>;
  addCustomTweet: (x: any, newTweet: any) => any;
  fetchCustomTweets: () => any;
  loading: boolean | undefined;
  cusomTweets: any;
}
const EMPTY_FORM: ICustomTweet = {
  authorHash: '',
  id: '',
  time: '',
  date: '',
  text: '',
};
interface newTweet {
  authorFullname: string;
  authorUsername: string;
  authorHash?: string | undefined;
  id: string;
  time: string;
  date: string;
  text: string;
}

export const Disconnect: FC<DisconnectProps> = (props: DisconnectProps) => {
  const { avatar, name, onLogout, addCustomTweet, fetchCustomTweets, loading, cusomTweets } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const [creationForm, setCreationForm] = useState<ICustomTweet>();
  const [isFocusButton, setFocusButton] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [id] = useState(Math.floor(Math.random() * 1_000_000));

  const [testTweets, setTestTweets] = useState<ICustomTweet[]>([]);

  useEffect(() => {
    const init = async () => {
      if (cusomTweets) {
        setTestTweets(cusomTweets.reverse());
      }

      anime({
        targets: wrapperRef.current,
        translateX: () => {
          return ['100%', '0%'];
        },
        easing: 'easeInOutSine',
      });
    };
    init();
    return () => {};
  }, [cusomTweets]);
  useEffect(() => {}, [isFocusButton, creationForm, inputValue, testTweets, itemRef]);
  const newVisible = (hash: string): string => {
    if (hash) {
      const firstFourCharacters = hash.substring(0, 5);
      const lastFourCharacters = hash.substring(hash.length - 0, hash.length - 5);
      return `${firstFourCharacters}...${lastFourCharacters}`;
    } else return hash;
  };
  const changeHandler = (e: any, value: any) => {
    e.preventDefault();
    const date = new Date().toDateString();
    const data = new Date();
    const hour = data.getHours();
    const minutes = data.getMinutes();
    const newForm = Object.assign({}, creationForm);
    newForm.authorHash = name;
    newForm.date = date;
    newForm.id = id.toString();
    newForm.text = value;
    newForm.time = `${hour} : ${minutes}`;

    setCreationForm(newForm);

    itemRef.current?.firstElementChild?.classList.add('nnn');
    setTimeout(() => {
      itemRef.current?.classList.add('ttt'),
        itemRef.current?.firstElementChild?.classList.add('mmm');
    }, 100);
    setTimeout(() => {
      itemRef.current?.firstElementChild?.classList.add('mmm');
    }, 500);
    setTimeout(() => {
      itemRef.current?.classList.remove('ttt'),
        itemRef.current?.firstElementChild?.classList.remove('mmm');
    }, 2500);
    setTimeout(() => {
      itemRef.current?.firstElementChild?.classList.remove('nnn');
    }, 4000);

    anime({
      targets: itemRef.current?.firstChild,
      position: 'absolute',
      translateY: () => {
        return ['-203px', '0px'];
      },

      duration: 4000,
    });

    testTweets?.unshift(newForm);

    setTestTweets(testTweets);

    addCustomTweet(e, newForm);
    handleClear()
  };
  const handleClear = ()=>{
    setInputValue('');
  }

  return (
    <div ref={wrapperRef} className={styles.wrapperDisconnect}>
      <div className={styles.bgline_top}></div>
      <div className={styles.bgline_medium}></div>
      <div className={styles.mediumLinesTop}></div>
      <div className={styles.mediumLinesMedium}></div>
      <div className={styles.mediumLinesBottom}></div>
      <div className={styles.mediumLinesLeftButton}></div>
      <div className={styles.bigLineLeft}></div>
      <div className={styles.bigLineBottom}></div>
      <div className={styles.bottomLineLeftOne}></div>
      <div className={styles.bottomLineLeftTwo}></div>
      <div className={styles.logoutBlock}>
        {name && (
          <div className={cn(styles.name, name.length > 23 ? styles.h2 : styles.h1)}>
            <p className={styles.nameText}>{newVisible(name)}</p>
          </div>
        )}
        <button className={styles.buttonLogout} onClick={onLogout}>
          Log out
        </button>
      </div>
      <div className={styles.writeTweetWrapper}>
        <textarea value={inputValue}
          onChange={(e) => {
            e.preventDefault();
            setInputValue(e.target.value);
          }}
          onBlur={() => {
            setFocusButton(false);
          }}
          onFocus={() => {
            setFocusButton(true);
          }}
          spellCheck={false}
          placeholder="What’s happening?"
          className={styles.writeTweet}
        ></textarea>
        <button
          type="button"
          className={cn(styles.sendTweet, {
            [styles.buttonSendFocus]: isFocusButton,
          })}
          onClick={(e) => {
            // console.log(creationForm);
            e.preventDefault();
            changeHandler(e, inputValue);
          }}
        ></button>
      </div>
      <div className={styles.tweetsBlock}>
        <h2 className={styles.tweetTitle}>
          My decentralized tweets <span className={styles.tweetTitleLine}></span>
        </h2>
        <div className={styles.tweetsBlockWrapper} ref={itemRef}>
          {testTweets &&
            // testTweets.length > 0 &&
            testTweets.map((x, i) => (
              <div key={i} className={styles.itemWrapper}>
                {x.authorHash !== null ? (
                  <h3 className={styles.label}>{newVisible(x.authorHash!)}</h3>
                ) : null}

                <div className={styles.desription}>{x.text}</div>
                <div className={styles.delimeterLine}></div>
                <div className={styles.info}>
                  <span className={styles.time}>{x.time}</span>
                  <span className={styles.delimeterDotted}></span>
                  <span className={styles.date}>{x.date}</span>
                  <span className={styles.delimeterDotted}></span>
                  <span className={styles.ipfs}>Stored in IPFS</span>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.counterBlock}>
          <span className={styles.counterLabel}>{testTweets.length} tweets crawled</span>
        </div>
        <span className={styles.footerDelimeter}></span>

        <div className={styles.connectionBlock}>
          <span className={styles.connection}>IPFS Connection:</span>
          <span className={styles.connectionStatus}>
            Stable <span className={styles.connectionStatusLabel}></span>
          </span>
        </div>
      </div>
    </div>
  );
};
