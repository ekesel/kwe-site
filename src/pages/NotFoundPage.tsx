import data from "@/data";
import { Button } from "@/components/ui";

const n = data.notFound;

export default function NotFoundPage() {
  return (
    <section className="grad-dark text-white container-x flex flex-col items-center justify-center text-center" style={{ minHeight: "100svh", paddingTop: 140, paddingBottom: 120 }}>
      <div className="serif text-g5 text-[88px] lg:text-[160px] leading-none">{n.code}</div>
      <h1 className="t-h2 text-white mt-6 mb-4">{n.title}</h1>
      <p className="t-body text-g6 m-0 max-w-[480px]">{n.body}</p>
      <div className="mt-10"><Button to={n.button.to} variant="ondark">{n.button.label}</Button></div>
    </section>
  );
}
