import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/options";
import SignoutButton from "@/components/signoutButton";
import HomeHere from "@/components/homeHere";

interface UserData {
  _id: string;
  allowed_roles: string[];
  name: string;
  email: string;
  account_type: string;
  address: string;
  country: string;
  phone: string;
  whatsapp: string;
  childage: string;
  childname: string;
  batch: string;
  rollclass: string;
  rollnumber: number;
  rollyear: string;
}

interface ResponseData {
  user: UserData;
  expires: string;
}

export default async function Home() {
  const session: ResponseData | null = await getServerSession(authOptions);
  const data: UserData | undefined = session?.user;

  return (
    <main className="h-full">
      <HomeHere />
      <div className="container">
        <div className="px-10 lg:px-80">
          <h1 className="text-4xl">Hi Bro</h1>
          <div className="max-w-96 overflow-scroll">
            {!!data && data.account_type}
          </div>
        </div>
      </div>
      <SignoutButton />
    </main>
  );
}
