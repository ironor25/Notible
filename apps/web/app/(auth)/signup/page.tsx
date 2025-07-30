"use client"
import {signIn} from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignUpPage(){
    const [name,setname] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router  = useRouter();

    const handleSignup = async (e :any) =>{
        e.preventDefault();
        setError('');
        const res = await axios.post(`${window.location.origin}/api/signup`,{
            name,
            email,
            password
        })
        console.log(res)
        if (res.data){
            console.log("inside")
            await signIn('credentials',{
            redirect:false,
            email,
            password
        });
            router.push('/');

        }
        else{
            setError("Invalid email or password");
        }
    }

    return (
        <div className="flex flex-col">
        <form onSubmit={handleSignup}>
      <input value={name} onChange={e => setname(e.target.value)} placeholder="name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />

      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
    {error}
        </div>
    )

}
