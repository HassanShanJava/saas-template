import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import forwardinbox from "@/assets/forward_to_inbox.svg";
import calender from "@/assets/calendar-vector-detail.svg";
import lastlogin from "@/assets/login_svgrepo.com.svg";
import profileimg from "@/assets/profile-image.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberTableDatatypes } from "@/app/types/member";
const { VITE_VIEW_S3_URL } = import.meta.env;


type BusinessDetailProps = {
  memberInfo: MemberTableDatatypes | undefined;
};

export default function BusinessDetailProfile({ memberInfo }: BusinessDetailProps) {
  console.log({ memberInfo })
  return memberInfo&&(
    <Card className="w-[100%] slg:w-[50%] sxl:max-w-xs ">
      <CardHeader>
        <h2 className="text-lg font-semibold">Member Details</h2>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-row gap-6 sxl:flex-col">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 !rounded-lg">
            <AvatarImage
              src={
                memberInfo?.profile_img
                  ? memberInfo?.profile_img.includes(VITE_VIEW_S3_URL)
                    ? memberInfo?.profile_img
                    : `${VITE_VIEW_S3_URL}/${memberInfo?.profile_img}` : ""
              }
              alt="Member profile picture"
            />
            <AvatarFallback className="uppercase">
              {(memberInfo.first_name as string).slice(0, 1) + (memberInfo.last_name as string).slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h3 className="font-semibold capitalize">{`${memberInfo?.first_name + " " + memberInfo?.last_name}`}</h3>
            <a
              href="#"
              className="text-sm text-nowrap text-blue-400 underline hover:text-blue-600 transition-colors"
            >
              View Member Profile
            </a>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img
                className="
              h-4 w-4
              "
                src={forwardinbox}
              ></img>
              <span>Send Message</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img
                className="
              h-4 w-4
              "
                src={calender}
              ></img>
              <span>Activation Date</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img
                className="
              h-4 w-4
              "
                src={lastlogin}
              ></img>
              <span>Last Login</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
