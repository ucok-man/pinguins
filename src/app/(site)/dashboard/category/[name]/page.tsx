import { formatEventCategoryName } from "@/lib/utils";
import DashboardContainer from "../../_components/dashboard-container";
import Content from "./content";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export default async function EventCategoryDetailPage({ params }: Props) {
  const { name } = await params;

  return (
    <DashboardContainer title={`${formatEventCategoryName(name)} events`}>
      <Content eventCategoryName={name} />
    </DashboardContainer>
  );
}
