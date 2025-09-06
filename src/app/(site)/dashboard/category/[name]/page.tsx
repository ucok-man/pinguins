import { formatEventCategoryName } from "@/lib/utils";
import DashboardContainer from "../../_components/dashboard-container";
import Content from "./content";

type Props = {
  params: {
    name: string;
  };
};

export default async function EventCategoryDetailPage({ params }: Props) {
  // const res = await api.eventCategory.getByName.$get({ name: params.name });
  // const { eventCategory } = await res.json();
  // if (!eventCategory) return notFound();

  return (
    <DashboardContainer
      title={`${formatEventCategoryName(params.name)} events`}
    >
      <Content eventCategoryName={params.name} />
    </DashboardContainer>
  );
}
