import React, { FC, useEffect, useState } from 'react';
import { Connect } from '../../pages/Connect';
import { Disconnect } from '../../pages/Disconnect';
import styles from './Login.module.scss'
import cn from 'classnames'

export interface LoginProps {
    logo?: string
      name: string
      avatar?: string
    message?:  string
    login: (e: any) => Promise<void>
      logout: (e: any) => Promise<void>
      disabled?: boolean
    loading?: boolean
  }
  
  export const Login: FC<LoginProps> = (props: LoginProps) => {
    const {
      logo,
      name,
      avatar,
      message,
      login,
      logout,
      disabled,
      loading,
    } = props;
  
      return (
          <div className={styles.wrapperLogin}>
        {name === ''
          ? <Connect
           
            message={message}
            label='Log in'
            onLogin={login}
            disabled={disabled}
            loading={loading}
          />
          : <Disconnect
            avatar={avatar}
            name={name}
            onLogout={logout}
          />}
          </div>
      );
  };