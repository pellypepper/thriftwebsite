import React, {useRef} from "react";
import Navbar from "../../component/navbar/navbar";
import {HomeGarden, Entertainment, Clothing, Electronics, Hobbies, Family} from "../../component/product/product";
import "./home.css";
import Sell from "../../component/sellform/sell";
import Footer from "../../component/footer/footer";



export default function Home({clerkSyncStatus, clerkUser, loading, handleSignOut}) {
  const sellRef = useRef(null);

    return(
      <main>
           <section>
           <Navbar 
  sellRef={sellRef} 
  clerkSyncStatus={clerkSyncStatus} 
  clerkUser={clerkUser} 
  loading={loading} 
  handleSignOut={handleSignOut} 
/>

           </section>
            <section ref={sellRef} className="sellform-wrapper">
              <Sell sellRef={sellRef} />
            </section>
            
            <section>
              <HomeGarden /> 
              <Entertainment/>
              <Clothing/>
              <Electronics />
              <Family />
              <Hobbies />
            </section>

             <section className="text-animate">
           
             </section>
            <section className="footer">

           <Footer />
            </section>


          
      </main>
    )
}