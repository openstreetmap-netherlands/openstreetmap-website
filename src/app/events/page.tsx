import React from "react";
import { TitledPage } from "@/components/layouts/titled-page";
import { ExternalButton } from "@/components/external-button";
import { EventClass, Event } from "@/types/event";
import { Metadata } from "next";
import { EventCard } from "@/components/event/event-card";

export const metadata: Metadata = {
  title: "OpenStreetMap Events",
  description: "The upcoming and past events of OpenStreetMap Netherlands,",
  keywords: ["OpenStreetMap", "Event", "OSM"],
};

const locations: any[] = [];

const addLocations = (events: Event[]) => {
  events.forEach((event: Event) => {
    if (event?.location?.short) {
      let splitLocation = event.location.short.split(",");
      let country = splitLocation[splitLocation.length - 1].trim();
      if (!locations.includes(country)) {
        locations.push(country);
      }
    }
  });
};

const getFutureEvents = async () => {
  const response = await fetch("https://osmcal.org/api/v2/events?in=nl", {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  const data = await response.json();
  addLocations(data);

  return data;
};

const getPastEvents = async () => {
  const response = await fetch("https://osmcal.org/api/v2/events/past?in=nl", {
    next: {
      revalidate: 60 * 60 * 24, // 1 day
    },
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  const data = await response.json();
  addLocations(data);

  return data;
};

export default async function EventsPage() {
  const futureEvents: Event[] = await getFutureEvents();
  const pastEvents: Event[] = await getPastEvents();

  return (
    <TitledPage
      title="Events"
      titlePostfix="OSMcal"
      subTitle="The upcoming and past events of OpenStreetMap Netherlands"
      actions={
        <ExternalButton href="https://osmcal.org/event/add/">
          Add event
        </ExternalButton>
      }
    >
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">
          Upcoming events
        </h3>
        <div className="flex flex-col gap-4">
          {futureEvents.length === 0 ? (
            <p>No upcoming events</p>
          ) : (
            futureEvents.map((event) => {
              const eventClass: EventClass = new EventClass(event);

              return <EventCard key={eventClass.id} event={eventClass} />;
            })
          )}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-4">Past events</h3>
        <div className="flex flex-col gap-4">
          {pastEvents.length === 0 ? (
            <p>No past events</p>
          ) : (
            pastEvents.map((event) => {
              const eventClass: EventClass = new EventClass(event);

              return <EventCard key={eventClass.id} event={eventClass} />;
            })
          )}
        </div>
      </div>
    </TitledPage>
  );
}
