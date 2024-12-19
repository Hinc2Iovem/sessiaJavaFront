export default function DivBgColor({ bgColor }: { bgColor: string }) {
  return <div className={`${bgColor} fixed z-[-999] top-0 bottom-0 left-0 right-0`}></div>;
}
