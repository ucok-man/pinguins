import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import DashboardContainer from "../../_components/dashboard-container";
import PaymentSuccessModal from "../../_components/payment-success-modal";
import CreateEventCategoryModal from "./_components/create-event-category-modal";
import Content from "./content";

type Props = {
  searchParams: Promise<{
    payment: string;
  }>;
};

export default async function DashboardPage(props: Props) {
  const { payment } = await props.searchParams;

  return (
    <>
      {payment === "success" && <PaymentSuccessModal />}

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
    </>
  );
}
