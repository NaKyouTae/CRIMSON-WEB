import React, { useState } from 'react';
import './LoginPage.css';
import { loginAPI } from '../../api/auth';
import { tokenStorage } from '../../api';
import { MemberLoginRequest } from '../../../generated/common/auth';

interface LoginPageProps {
  onLogin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Login attempt:', formData);
      
      // API 호출
      const loginRequest: MemberLoginRequest = {
        email: formData.email,
        password: formData.password
      };
      
      const response = await loginAPI.memberLogin(loginRequest);
      console.log('Login response:', response);
      
      // 로그인 성공 시 토큰 저장
      if (response.token) {
        // 서버 응답에서 토큰 추출 (실제 응답 구조에 맞게 수정 필요)
        const tokens = {
          accessToken: response.token.accessToken || response.token,
          refreshToken: response.token.refreshToken || response.refreshToken
        };
        
        // 토큰 저장
        tokenStorage.setTokens(tokens);
        console.log('로그인 성공, 토큰이 저장되었습니다.');
        onLogin?.();
      } else {
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
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
                <label htmlFor="email" className="input-label">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder="이메일을 입력하세요"
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
              
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
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
