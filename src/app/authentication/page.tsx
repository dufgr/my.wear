import { Header } from "@/components/common/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";

const Authentication = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) => {
  const { callbackUrl } = await searchParams;
  const redirectTo =
    typeof callbackUrl === "string" &&
    callbackUrl.startsWith("/") &&
    !callbackUrl.startsWith("//") &&
    !callbackUrl.includes("\\")
      ? callbackUrl
      : "/";

  return (
    <>
      <Header />

      <div className="flex w-full flex-col gap-6 p-5">
        <Tabs defaultValue="sign-in">
          <TabsList>
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in" className="w-full">
            <SignInForm
              redirectTo={redirectTo}
              googleAuthEnabled={
                Boolean(process.env.GOOGLE_CLIENT_ID) &&
                Boolean(process.env.GOOGLE_CLIENT_SECRET)
              }
            />
          </TabsContent>
          <TabsContent value="sign-up" className="w-full">
            <SignUpForm redirectTo={redirectTo} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authentication;
