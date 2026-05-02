import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface LoginScreenProps { onLogin: (username:string, password:string)=>void }

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return <div className='min-h-screen flex items-center justify-center p-6' style={{ background: 'var(--login-background)' }}>
    <Card className='w-full max-w-md p-6 bg-[#F5F0E8]'>
      <h2 className='mb-2'>Вход в CozySpot</h2>
      <p className='text-sm text-muted-foreground mb-4'>Демо: waiter/admin/director, пароль 123456</p>
      <div className='space-y-3'>
        <Input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='Логин' />
        <Input value={password} type='password' onChange={(e)=>setPassword(e.target.value)} placeholder='Пароль' />
        <Button className='w-full' onClick={()=>onLogin(username.trim(), password)}>Войти</Button>
      </div>
    </Card>
  </div>
}
