import { Card } from "@/components/ui/card";
import {
  resetBackPageCount,
  setCode,
  setCounter,
} from "@/features/counter/counterSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import cashcounter from "@/assets/cashier-counter.svg";
import {
  useGetCountersQuery,
  useUpdateCountersMutation,
} from "@/services/counterApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useEffect, useMemo } from "react";
import { CounterDataType } from "@/app/types/pos/counter";
import { ErrorType } from "@/app/types";
import { toast } from "@/components/ui/use-toast";
import useDocumentTitle from "@/components/ui/common/document-title";
const CounterSelection = () => {
  const pos_count = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("accessLevels") as string).pos_count ??
        "no_access"
      );
    } catch {
      return "no_access";
    }
  })();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { counter_number } = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: assignedCounter, isLoading } = useGetCountersQuery({
    query: `status=active${pos_count !== "full_access" ? `&staff_id=${userInfo?.user?.id}` : ""}`,
  });

  const assignedCounterData = useMemo(() => {
    return Array.isArray(assignedCounter?.data) ? assignedCounter?.data : [];
  }, [assignedCounter]);

  const [assignCounter, { isLoading: isUpdating, isError }] =
    useUpdateCountersMutation();

  const assignSingleCounter = async (
    counter: CounterDataType,
    toastMsg?: string
  ) => {
    if (counter.staff) {
      // staff array
      const singleCounter = counter.staff[0];
      console.log({ singleCounter }, counter.staff, "counter.staff");

      try {
        const payload = {
          id: counter.id,
          is_open: true,
        };
        const resp = await assignCounter(payload).unwrap();
        if (!resp.error) {
          console.log({ resp });
          toast({
            variant: "success",
            title: toastMsg,
          });
          dispatch(setCounter(counter.id as number));
          dispatch(setCode("pos"));
          navigate("/admin/pos/sell/");
        } else {
          throw resp.error;
        }
      } catch (error) {
        console.error("Error", { error });
        if (error && typeof error === "object" && "data" in error) {
          const typedError = error as ErrorType;
          toast({
            variant: "destructive",
            title: "Error in Submission",
            description: `${typedError.data?.detail}`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error in Submission",
            description: `Something Went Wrong.`,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (counter_number == null && assignedCounterData?.length === 1) {
      assignSingleCounter(
        assignedCounterData[0],
        "Counter Opened Successfully"
      );
    }
  }, [assignedCounterData, assignCounter, dispatch, navigate, userInfo]);


  console.log({ assignedCounterData })
  useDocumentTitle("Counter Management");

  return (
    <div className="min-h-screen bg-outletcolor p-5">
      {!isLoading && (
        <>
          {assignedCounter && assignedCounter.data.length >= 1 ? (
            <Card className="p-5 space-y-4 w-fit mx-auto">
              <div className="flex justify-between items-center gap-2">
                <p>Please select a counter to start selling</p>
                <Link
                  to={"/"}
                  className="text-primary"
                  onClick={() => {
                    dispatch(setCode(null));
                    dispatch(setCounter(null));
                    dispatch(resetBackPageCount());
                  }}
                >
                  <i className="rounded-[50%] fa fa-arrow-left px-2 py-0.5 mr-2 text-base border-2 border-primary text-primary"></i>
                  Back to gym
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-10 w-fit mx-auto justify-center items-center">
                {assignedCounterData.map((item: CounterDataType, i: number) => (
                  <button
                    key={i}
                    onClick={() =>
                      assignSingleCounter(item, "Counter Opened Successfully")
                    }
                    className={`relative 
                      ${item.is_open && item.staff_id !== userInfo?.user.id && "!bg-lightwarning border border-lightwarningborder"}
                      ${item.is_open && item.staff_id == userInfo?.user.id && "!bg-lightprimary border border-lightprimaryborder"}
                      cursor-pointer rounded-md size-52 flex flex-col justify-center items-center  ${!item.is_open && "bg-outletcolor"
                      }`}
                  >
                    {item.is_open && (
                      <p className="absolute top-4 ">
                        {item.staff_id == userInfo?.user.id
                          ? "Enter Here"
                          : "In Use"}
                      </p>
                    )}
                    <img src={cashcounter} alt="/" className="p-0 size-28" />
                    <p
                      className={`text-center text-lg capitalize ${item.is_open && ""} `}
                    >
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          ) : (
            assignedCounterData.length === 0 && (
              <Card className="w-full p-5 space-y-4 max-w-2xl mx-auto">
                <div className="flex justify-end items-center">
                  <Link
                    to={"/"}
                    className="text-primary"
                    onClick={() => {
                      dispatch(setCode(null));
                      dispatch(setCounter(null));
                      dispatch(resetBackPageCount());
                    }}
                  >
                    <i className="rounded-[50%] fa fa-arrow-left px-2 py-0.5 mr-2 text-base border-2 border-primary text-primary"></i>
                    Back to gym
                  </Link>
                </div>
                <p className="w-full text-center">
                  No Counter has been assigned to you.
                  <br />
                  Please contact your admin supervisor.
                </p>
              </Card>
            )
          )}
        </>
      )}

      {assignedCounterData.length === 1 && !isError && (
        <div className="fixed top-0 left-0 z-40 w-full h-screen flex justify-center items-center bg-black/40">
          <i className="animate-spin text-primary text-3xl font-bold text-main fas fa-spinner"></i>
        </div>
      )}
    </div>
  );
};

export default CounterSelection;
