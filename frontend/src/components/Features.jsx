import { Headphones, Shield, Truck } from "lucide-react";
import React from "react";

function Features() {
  return (
    <section className="bg-muted/50 pb-8 pt-3">
      <div className="max-w-7xl mx-auto px-2 md:px-4 ">
        <div className="grid md:grid-cols-3  gap-10 p-3">
          <div className="flex items-center  gap-4">
            <div className="logo h-12 w-12 rounded-full flex items-center justify-center bg-blue-100">
              <Truck className="h-7 w-7 text-blue-600" />
            </div>
            <div className="logo-info ">
              <h3 className="font-semibold">Free shipping</h3>
              <p className="text-muted-foreground">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="logo  h-12 w-12 rounded-full flex items-center justify-center bg-green -100">
              <Shield className="h-8 w-8 text-green-400" />
            </div>
            <div className="logo-info ">
              <h3 className="font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <div className="logo  h-12 w-12 rounded-full flex items-center justify-center bg-blue-100">
              <Headphones className="h-7 w-7 text-orange-400" />
            </div>
            <div className="logo-info ">
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">Always here to help</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
