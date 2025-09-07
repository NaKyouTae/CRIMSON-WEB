import React, { useState } from 'react';

const LoginPage = ({}) => {
  return (
    <main>
      <div className='login-wrap'>
        <div className='login-box'>
          <img src='/img/logo/img-logo01.svg' />
          <p>마케팅 대표 문구 삽입 예정</p>
          <ul className='info-input'>
            <li>
              <span>아이디</span>
              <input type='text' placeholder='아이디를 입력해 주세요.' />
            </li>
            <li>
              <span>비밀번호</span>
              <input type='password' placeholder='비밀번호를 입력해 주세요.' />
            </li>
            <li>
              <button>로그인</button>
            </li>
          </ul>
          <div className='line'><span>또는</span></div>
          <button className='btn-kakao-login'><span>카카오로 시작하기</span></button>
          <div className='account'>
            <a href='#'>회원가입</a>
            <ul>
              <li><a href='#'>아이디 찾기</a></li>
              <li><a href='#'>비밀번호 찾기</a></li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
