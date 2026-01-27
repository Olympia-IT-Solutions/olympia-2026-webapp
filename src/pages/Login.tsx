import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { login } from '../logic/rights';

const PageContainer = styled.div`
  position: relative;
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-color);
`;

const ImageSection = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.55);
  color: var(--card-text);
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 18px rgba(0,0,0,0.35);

  &:hover {
    background: rgba(0,0,0,0.7);
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  padding: 80px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  color: var(--text-color);
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: bold;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 0;
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--text-color);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--text-color);
    background-color: var(--muted-bg);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 30px;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  border: none;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: var(--hover-bg);
  }
`; 

export function Login() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      navigate(`/${lang}/dashboard`);
    } else {
      setError(t('login.invalidCredentials'));
    }
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)} aria-label={t('login.back')}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('login.back')}
      </BackButton>

      <ImageSection>
        <img
          alt="Login Illustration"
          src="https://img.olympics.com/images/image/private/t_s_w960/primary/lhn24fjdqgglv3wlvxbw"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </ImageSection>

      <FormSection>
        <FormContainer>
          <Title>{t('login.title')}</Title>
          
          <form onSubmit={handleLogin}>
            <InputGroup>
              <Label>{t('login.email')}</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </InputGroup>
            
            <InputGroup>
              <Label>{t('login.password')}</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </InputGroup>

            <Button type="submit">{t('login.submit')}</Button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </FormContainer>
      </FormSection>
    </PageContainer>
  );
}
