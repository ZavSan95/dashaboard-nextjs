
import { CartCounter } from "@/app/shopping-cart";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Counter Page',
  description: 'Un simple contador'
}

export default function CounterPage() {


  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <span>Productos</span>
      <CartCounter value={ 5 }/>
    </div>
  );
}