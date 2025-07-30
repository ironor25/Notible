"use client"
import {signIn} from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignInPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router  = useRouter();

    const handleLogin = async (e :any) =>{
        e.preventDefault();
        setError('');
       const res = await signIn('credentials',{
            redirect:false,
            email,
            password
        });
        
        if (res?.ok){
            
            router.push('/');

        }
        else{
            setError("Invalid email or password");
        }
    }
    return (
          <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 100 }}>
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <button type="submit" style={{ width: '100%' }}>Sign In</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  
    )
}