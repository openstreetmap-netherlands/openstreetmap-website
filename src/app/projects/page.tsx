import React from "react";
import { TitledPage } from "@/components/layouts/titled-page";
import Image from "next/image";
import { SeparatorTypes } from "@/enums/separator-types";
import Link from "next/link";
import { projectLists } from "./data";
import { Title } from "@/components/layouts/title";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenStreetMap Projecten",
  description: "Zie hier de projecten van OpenStreetMap Nederland.",
};

export default function ProjectsPage() {
  return (
    <TitledPage
      title="Projecten"
      subTitle="Een overzicht van projecten en tools die worden gebruikt bij OpenStreetMap."
      separator={SeparatorTypes.none}
    >
      {projectLists.map((projectsList) => {
        return (
          <div className="flex flex-col gap-4" key={projectsList.name}>
            <Title size="h2" title={projectsList.name} />

            {projectsList.projects.map((project) => {
              return (
                <Link
                  key={project.name}
                  href={`/projects/${project.name
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  <Card
                    key={project.name}
                    className="gap-4 p-4 justify-between grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
                  >
                    <div className="flex flex-col gap-2 col-span-1 lg:col-span-1">
                      <Title
                        size="h3"
                        title={project.name}
                        titlePostfix={project.altName && `(${project.altName})`}
                      />
                      <p>{project.description}</p>
                    </div>

                    {project.image && (
                      <div
                        className="justify-center items-center relative
                          col-span-1
                        "
                        style={{ height: "300px" }}
                      >
                        <Image
                          className="overflow-hidden rounded-md"
                          objectFit="cover"
                          alt={project.name}
                          src={project.image}
                          fill
                        />
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        );
      })}
    </TitledPage>
  );
}
