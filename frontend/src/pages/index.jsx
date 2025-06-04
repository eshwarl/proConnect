import Head from "next/head";
import Image from "next/image";

import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
     <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>
          <p>"Connecting Ambitions, Creating Futures."</p>
          <p>"From Profiles to Possibilities – Connect the Dots."</p>
          <p>
            "Join us in building a world where every connection counts."
          </p>
          <div onClick={()=>{
           router.push("/login")
          }} className={styles.buttonJoin}>
            <p>Join Now</p>
          </div>
        </div>
        <div className={styles.mainContainer_right}>
          <img src="images/proconnect.jpg" alt="hero" />
        </div>
      </div>
     </div>
    </UserLayout>
  );
}
