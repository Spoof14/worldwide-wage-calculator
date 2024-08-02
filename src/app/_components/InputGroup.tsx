type InputGroupProps = React.PropsWithChildren<{
  flexDirection?: "row" | "column";
}>;
export const InputGroup = ({
  flexDirection = "row",
  children,
}: InputGroupProps) => {
  return (
    <div
      className={`flex flex-wrap gap-2 ${flexDirection === "row" ? "flex-row" : "flex-col"}`}
    >
      {children}
    </div>
  );
};
