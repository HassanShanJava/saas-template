import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface CustomCollapsibleProps {
  title: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
}

export default function CustomCollapsible({
  title,
  children,
  isOpenDefault = true,
}: CustomCollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(isOpenDefault);

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={toggleCollapsible}>
      <div className="border rounded-md p-4">
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="mt-2">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
