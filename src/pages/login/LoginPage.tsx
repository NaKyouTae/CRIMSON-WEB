import React, { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    
    // 간단한 로그인 검증 (실제로는 API 호출)
    if (formData.username && formData.password) {
      onLogin?.();
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left"></div>
        
        <div className="login-center">
          <div className="login-form-container">
            <div className="logo-container">
              <h1 className="logo">거기어때?</h1>
            </div>
            
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username" className="input-label">아이디</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder="아이디를 입력하세요"
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="password" className="input-label">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              
              <button type="submit" className="login-button">
                로그인
              </button>
            </form>
          </div>
        </div>
        
        <div className="login-right"></div>
      </div>
    </div>
  );
};

export default LoginPage;
