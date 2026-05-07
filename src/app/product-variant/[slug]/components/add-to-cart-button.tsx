"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { isLocalAuthBypassEnabled } from "@/lib/local-auth-config";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationKey: ["addProductToCart", productVariantId, quantity],
    mutationFn: () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produto adicionado à sacola.");
    },
    onError: () => {
      toast.error("Não foi possível adicionar o produto à sacola.");
    },
  });

  const handleAddToCart = () => {
    if (!isLocalAuthBypassEnabled && isSessionPending) {
      toast.info("Verificando sua sessão. Tente novamente em instantes.");
      return;
    }
    if (!isLocalAuthBypassEnabled && !session?.user) {
      toast.info("Entre na sua conta para adicionar produtos à sacola.");
      router.push(`/authentication?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    mutate();
  };

  return (
    <Button
      className="rounded-full"
      size="lg"
      variant="outline"
      disabled={isPending}
      onClick={handleAddToCart}
    >
      {isPending && <Loader2 className="animate-spin" />}
      Adicionar à sacola
    </Button>
  );
};

export default AddToCartButton;
