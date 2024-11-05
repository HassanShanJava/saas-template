import BusinessDetailTabs from "./business-card-detail-tabs";
import BusinessDetailProfile from "./business-card-profile";

export default function BusinessDetail() {
  return (
    <div
      className=" p-5 flex flex-col gap-3  justify-start items-start
    sxl:flex-row
    "
    >
      <BusinessDetailProfile />
      <BusinessDetailTabs />
    </div>
  );
}
