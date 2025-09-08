import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MemberLoginRequest } from '../../../generated/common/auth';
import { loginAPI } from '../../api/auth';
import { tokenStorage } from '../../utils/tokenManager';

interface LoginPageProps {
  onLogin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 시 에러 메시지 초기화
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!validateForm()) {
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
        // 서버 응답에서 토큰 추출
        const tokens = {
          accessToken: response.token.accessToken,
          refreshToken: response.token.refreshToken
        };
        
        // 토큰 저장
        tokenStorage.setTokens(tokens);
        console.log('로그인 성공, 토큰이 저장되었습니다.');
        onLogin?.();
        // 메인 페이지로 리다이렉트
        navigate('/main');
      } else {
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // API 에러 응답 처리
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        switch (status) {
          case 401:
            alert('이메일 또는 비밀번호가 올바르지 않습니다.');
            break;
          case 404:
            alert('존재하지 않는 사용자입니다.');
            break;
          case 500:
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            alert(message || '로그인 중 오류가 발생했습니다.');
        }
      } else if (error.request) {
        alert('네트워크 연결을 확인해주세요.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main>
      <div className='login-wrap'>
        <div className='login-box'>
          <img src='/img/logo/img-logo01.svg' />
          <p>마케팅 대표 문구 삽입 예정</p>
          <form onSubmit={handleSubmit}>
            <ul className='info-input'>
              <li>
                <span>아이디</span>
                <input 
                  type='email' 
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='이메일을 입력해 주세요.'
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </li>
              <li>
                <span>비밀번호</span>
                <input 
                  type='password' 
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder='비밀번호를 입력해 주세요.'
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </li>
              <li>
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </button>
              </li>
            </ul>
          </form>
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
