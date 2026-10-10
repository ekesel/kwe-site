import { useContent } from "@/content/ContentProvider";
import { TextLink, usePageTitle } from "@/components/primitives";

export default function NotFoundPage() {
  const data = useContent();
  const n = data.notFound;
  usePageTitle(n.title);
  return (
    <section>
      <div className="wrap section-full !pt-40 lg:!pt-56">
        <div className="grid-12 rule-t pt-6 gap-y-6">
          <div className="lead-col"><span className="label t-eyebrow text-ink-2">{n.code}</span></div>
          <div className="main-col">
            <h1 className="t-h1 text-forest-900">{n.title}</h1>
            <p className="t-body text-ink-2 mt-6 max-w-[640px]">{n.body}</p>
            <div className="mt-10"><TextLink to={n.button.to}>{n.button.label}</TextLink></div>
          </div>
        </div>
      </div>
    </section>
  );
}
