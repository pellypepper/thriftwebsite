import React, {useRef} from "react";
import Navbar from "../../component/navbar/navbar";
import {HomeGarden, Entertainment, Clothing} from "../../component/product/product";
import "./home.css";
import Sell from "../../component/sellform/sell";

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
            </section>


          
      </main>
    )
}