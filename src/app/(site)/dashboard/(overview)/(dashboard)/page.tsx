import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import CreateEventCategoryModal from "../../_components/create-event-category-modal";
import DashboardContainer from "../../_components/dashboard-container";

export default function DashboardPage() {
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
      {/* <PageContent /> */}
    </DashboardContainer>
  );
}
