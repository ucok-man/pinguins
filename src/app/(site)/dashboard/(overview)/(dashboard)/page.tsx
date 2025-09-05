import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import DashboardContainer from "../../_components/dashboard-container";
import CreateEventCategoryModal from "./_components/create-event-category-modal";
import Content from "./content";

export default function DashboardPage() {
  // TODO: handle upgrade plan

  return (
    <DashboardContainer
      cta={
        <CreateEventCategoryModal>
          <Button className="w-full cursor-pointer">
            <PlusIcon className="size-4 mr-2" />
            Add Category
          </Button>
        </CreateEventCategoryModal>
      }
      title="Dashboard"
      hideBackButton={true}
    >
      <Content />
    </DashboardContainer>
  );
}
