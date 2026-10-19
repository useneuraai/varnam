import { Metadata } from "next";
import RsvpManagementClient from "./RsvpManagementClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  return {
    title: `Guest RSVPs | Varnam Invites`,
    description: `Manage guest RSVP responses and attendance for your wedding invitation.`,
  };
}

export default async function RsvpManagementPage(props: PageProps) {
  const { slug } = await props.params;
  return <RsvpManagementClient slug={slug} />;
}
