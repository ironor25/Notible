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
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f5f7fb' }}>
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 12, boxShadow: '0 6px 20px rgba(16,24,40,0.08)', padding: 28 }}>
              <div style={{ textAlign: 'center', marginBottom: 18 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: '#6366f1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, marginBottom: 12 }}>
                  N
                </div>
                <h2 style={{ margin: 0, fontSize: 20 }}>Welcome back</h2>
                <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 13 }}>Sign in to continue to Notable</p>
              </div>

              <form onSubmit={handleLogin} aria-label="Sign in form">
                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  required
                  onChange={e => setEmail(e.target.value)}
                  style={{ display: 'block', marginBottom: 12, width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: 14, outline: 'none' }}
                />

                <label style={{ display: 'block', fontSize: 13, color: '#374151', marginBottom: 6 }}>Password</label>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)}
                  style={{ display: 'block', marginBottom: 16, width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6e9ef', fontSize: 14, outline: 'none' }}
                />

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" style={{ flex: 1, padding: '10px 12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/signup')}
                    style={{ flex: 1, padding: '10px 12px', background: 'transparent', color: '#374151', border: '1px solid #e6e9ef', borderRadius: 8, cursor: 'pointer' }}
                  >
                    Create account
                  </button>
                </div>

                {error && <p role="alert" style={{ color: 'rgb(220,38,38)', marginTop: 12, fontSize: 13 }}>{error}</p>}
              </form>
            </div>
          </div>
    )
}