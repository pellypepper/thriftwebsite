import React from "react";

import {HomeGarden, Entertainment, Clothing, Electronics, Hobbies, Family} from "../../component/product/product";
import "./home.css";

import Footer from "../../component/footer/footer";



export default function Home({clerkSyncStatus, clerkUser, loading, handleSignOut}) {


    return(
      <main>
        
            
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