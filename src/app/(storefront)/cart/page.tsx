import { CartPage } from "@/components/cart/cart-page";
import { getCurrentCart } from "@/lib/data/cart-view";

export default async function CartRoute() {
    const cart = await getCurrentCart();

    return <CartPage cart={cart} />
}