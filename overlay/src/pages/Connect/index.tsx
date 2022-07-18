import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './Connect.module.scss';
import cn from 'classnames';
import anime from 'animejs';

export interface ConnectProps {
  logo?: string;
  message?: string;
  label: string;
  onLogin: (e: any) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}
export const Connect: FC<ConnectProps> = (props: ConnectProps) => {
  const { logo, message, label, onLogin, disabled, loading } = props;
  const [isLoader, setLoader] = useState(false);
  const liRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    anime({
      targets: liRef.current,
      rotate: () => {
        if (isLoader === true) {
          return ['0deg', '5deg'];
        } else if (isLoader === false) {
          return ['90deg ', '0deg'];
        } else if (loading === true && isLoader === true) {
          return ['0deg ', '-180deg'];
        } else if (loading === false && isLoader === false) {
          return ['-180deg ', '0deg'];
        }
      },
    
      // duration:1500
    });
  
  },[liRef,isLoader,loading]);
  useEffect(()=>{
    const init =()=>{
      anime({
        targets: wrapperRef.current,
        translateX: () => {
          return ['100%', '0%'];
        },
        easing: 'easeInOutSine'
       
      });
    }
    init()
    return ()=>{
    
    }
  },[])
 
  return (
    <div ref={wrapperRef} className={styles.wrapperConnect}>
      <div className={styles.bg}></div>
      <div className={styles.bg_line_left}></div>
      <div className={styles.bg_line_top}></div>
      <div className={styles.bg_line_bottom}></div>
      <div className={styles.bg_line_few}>
        <span className={styles.line_top}></span>
        <span className={styles.line_middle}></span>
        <span className={styles.line_bottom}></span>
      </div>
      <div className={styles.bg_line_single}></div>
      <h1 className={styles.title}>/tweery</h1>
      {message && (
        <div className={styles.message}>
          <p className={styles.messageText}>{message}</p>
        </div>
      )}
      <button
        // onMouseEnter={()=>{setLoader(true)}}
        ref={buttonRef}
        className={cn(styles.buttonLogin, {
          [styles.isHoverButton]: isLoader,
          [styles.isActiveButton]: loading,
        })}
        onClick={onLogin}
        disabled={disabled}
      >
        {loading ? 'Logging' : label}
        <span
          onMouseLeave={() => setLoader(false)}
          onMouseEnter={() => {
            setLoader(true);
          }}
          ref={liRef}
          className={cn(styles.buttonLabel, {
            [styles.isHover]: isLoader || loading,
          })}
        ></span>
      </button>
    </div>
  );
};
