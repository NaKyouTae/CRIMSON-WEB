// 토큰 관리 유틸리티
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(tokens: TokenPair): void;
  clearTokens(): void;
  isTokenExpired(token: string): boolean;
}

// 쿠키 기반 토큰 저장소 (권장)
class CookieTokenStorage implements TokenStorage {
  getAccessToken(): string | null {
    return this.getCookie('accessToken');
  }

  getRefreshToken(): string | null {
    return this.getCookie('refreshToken');
  }

  setTokens(tokens: TokenPair): void {
    // Access Token: 짧은 만료시간, httpOnly
    this.setCookie('accessToken', tokens.accessToken, 0.25); // 15분
    
    // Refresh Token: 긴 만료시간, httpOnly
    this.setCookie('refreshToken', tokens.refreshToken, 7); // 7일
  }

  clearTokens(): void {
    this.deleteCookie('accessToken');
    this.deleteCookie('refreshToken');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${window.location.protocol === 'https:'}`;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
}

// localStorage 기반 토큰 저장소 (대안)
class LocalStorageTokenStorage implements TokenStorage {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(tokens: TokenPair): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

// 토큰 저장소 팩토리
export const createTokenStorage = (useCookies: boolean = true): TokenStorage => {
  return useCookies ? new CookieTokenStorage() : new LocalStorageTokenStorage();
};

// 기본 토큰 저장소 (쿠키 우선, localStorage 대체)
export const tokenStorage: TokenStorage = (() => {
  // 쿠키를 지원하는지 확인
  if (typeof document !== 'undefined' && document.cookie !== undefined) {
    return new CookieTokenStorage();
  }
  return new LocalStorageTokenStorage();
})();
