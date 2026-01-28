import React, { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = createContext({});

const Accordion = ({
  children,
  type = "single",
  collapsible = false,
  className,
  ...props
}) => {
  const [value, setValue] = useState(type === "single" ? "" : []);

  const toggleItem = (itemValue) => {
    if (type === "single") {
      if (value === itemValue && collapsible) {
        setValue("");
      } else {
        setValue(itemValue);
      }
    } else {
      // Multiple
      if (value.includes(itemValue)) {
        setValue(value.filter((v) => v !== itemValue));
      } else {
        setValue([...value, itemValue]);
      }
    }
  };

  return (
    <AccordionContext.Provider value={{ value, toggleItem, type }}>
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = ({ children, value, className, ...props }) => {
  return (
    <div className={cn("border-b", className)} {...props} data-value={value}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemValue: value });
        }
        return child;
      })}
    </div>
  );
};

const AccordionTrigger = ({ children, className, itemValue, ...props }) => {
  const { value, toggleItem } = useContext(AccordionContext);
  const isOpen = Array.isArray(value)
    ? value.includes(itemValue)
    : value === itemValue;

  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => toggleItem(itemValue)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
          isOpen && "[&>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    </div>
  );
};

const AccordionContent = ({ children, className, itemValue, ...props }) => {
  const { value } = useContext(AccordionContext);
  const isOpen = Array.isArray(value)
    ? value.includes(itemValue)
    : value === itemValue;

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all animate-in fade-in slide-in-from-top-1 duration-200",
        className,
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </div>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
