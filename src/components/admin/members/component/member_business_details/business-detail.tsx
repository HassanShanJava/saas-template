import { useParams } from "react-router-dom";
import BusinessDetailTabs from "./business-card-detail-tabs";
import BusinessDetailProfile from "./business-card-profile";
import { useGetMemberByIdQuery } from "@/services/memberAPi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

export default function BusinessDetail() {

  const { memberId } = useParams()
  const orgId = useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;

  const { data: memberInfo } = useGetMemberByIdQuery({ org_id: orgId, id: Number(memberId) }, {
    skip: !memberId
  })



  return memberInfo&&(
    <div
      className=" p-5 flex flex-col gap-3  justify-start items-start sxl:flex-row "
    >
      <BusinessDetailProfile memberInfo={memberInfo} />
      <BusinessDetailTabs />
    </div>
  );
}
