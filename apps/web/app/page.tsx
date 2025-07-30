import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Home from "./components/home";

export default async function main() {

  const session  = await getServerSession(authOptions)  
  console.log(session)
  if (!session){
    redirect("/signup")
  }

 
  return (
   <div>
    <Home/>
   </div>
  );
}
