"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TitledPage } from "@/components/layouts/titled-page";
import { SeparatorTypes } from "@/enums/separator-types";
import { Alert } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import Overview from "./overview";
import Changesets from "./changesets";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { set } from "date-fns";
import { SignInButton } from "@/components/header/sign-in-button";

export default function Dashboard() {
  const [healthy, setHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const session = useSession();
  useEffect(() => {
    const sesionUser = session?.data?.user;

    if (sesionUser) {
      setLoading(false);
    }
  }, [session]);

  const BagMapContainer = dynamic(
    () =>
      import("../../components/map/containers/bag-map-container").then(
        (m) => m.BagMapContainer
      ),
    {
      ssr: false,
    }
  );

  const { toast } = useToast();

  useEffect(() => {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    fetch(`${baseUrl}/api/bagbot/health`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setHealthy(true);
        }
      })
      .catch((error) => {
        setHealthy(false);
      });
  }, []);

  if (session.status === "unauthenticated") {
    return (
      <div className="container my-8">
        <Alert>This page is only accessible for authenticated users.</Alert>
      </div>
    );
  }

  return loading ? (
    <div className="container my-8">
      <Alert>Loading...</Alert>
    </div>
  ) : (
    <TitledPage
      title="BagBot"
      titlePostfix="console"
      subTitle="BagBot is a tool to help manage the BAG import in the Netherlands."
      separator={SeparatorTypes.none}
      actions={
        <Button
          variant={"outline"}
          onClick={(e) => {
            toast({
              title: "Documentation",
              description:
                "Op dit moment is er nog geen documentatie beschikbaar.",
              duration: 3000,
            });
          }}
        >
          Documentation
          <ExternalLink className="w-4 h-4 ml-2"></ExternalLink>
        </Button>
      }
    >
      <Alert>
        BagBot backend status:{" "}
        {healthy === null ? (
          <span className="text-yellow-500">checking</span>
        ) : healthy === true ? (
          <span className="text-green-500">running</span>
        ) : (
          <span className="text-red-500">not running</span>
        )}
      </Alert>
      <Tabs defaultValue="changesets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="changesets">Changesets</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="manualcontrol">Manual control</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview></Overview>
        </TabsContent>

        <TabsContent value="changesets" className="space-y-4">
          <Changesets></Changesets>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>
        </TabsContent>

        <TabsContent value="manualcontrol" className="space-y-4">
          <BagMapContainer></BagMapContainer>
        </TabsContent>
      </Tabs>
    </TitledPage>
  );
}
