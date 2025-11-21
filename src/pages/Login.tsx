import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { login } from '../logic/rights';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #003049;
`;

const ImageSection = styled.div`
  flex: 1;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #003049;
  padding: 40px;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  color: white;
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
  border: 1px solid rgba(255, 255, 255, 0.5);
  background-color: transparent;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 30px;
  background-color: white;
  color: #003049;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

export function Login() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, password);
    if (user) {
      navigate(`/${lang}/dashboard`);
    } else {
      setError('Ungültige Anmeldedaten');
    }
  };

  return (
    <PageContainer>
      <ImageSection>
        <span style={{ color: '#666', fontSize: '1.5rem' }}>Image Placeholder</span>
      </ImageSection>
      <FormSection>
        <FormContainer>
          <Title>Willkommen</Title>
          
          <form onSubmit={handleLogin}>
            <InputGroup>
              <Label>Email *</Label>
              <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Password *</Label>
              <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </InputGroup>

            <Button type="submit">Weiter</Button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </FormContainer>
      </FormSection>
    </PageContainer>
  );
}
