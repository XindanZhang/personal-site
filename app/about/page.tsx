import Link from "next/link";
import { SectionHeading } from "../../components/section-heading";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

export default function AboutPage() {
  return (
    <SiteLayout active="about">
      <div className="space-y-6">
        <section>
          <SectionHeading as="h1" title="About" />
          <div className="space-y-4">
            <p className="font-mono text-sm leading-relaxed">{site.about.intro}</p>
            <p className="font-mono text-sm leading-relaxed text-gray-600">{site.about.body}</p>
          </div>
        </section>

        <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />

        <section className="space-y-4">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider">Skills</h2>
          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
            {site.skillGroups.map((group) => (
              <div key={group.title} className="border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="border-b border-black bg-gray-100 px-4 py-2 font-mono text-xs font-bold uppercase">
                  {group.title}
                </div>
                <div className="flex flex-wrap gap-2 p-4">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="border border-black bg-white px-2 py-1 font-mono text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-4 w-full border-0 border-t border-black" />

        <section className="space-y-4">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider">Timeline</h2>
          <div className="border border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
            {site.timeline.map((entry, index) => (
              <div
                key={entry.year}
                className={`flex items-start gap-4 p-4 ${index === site.timeline.length - 1 ? "" : "border-b border-black"}`}
              >
                <span className="inline-flex items-center justify-center border border-black bg-[#d4a72c] px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]">
                  {entry.year}
                </span>
                <p className="font-mono text-sm">{entry.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-4 w-full border-0 border-t border-black" />

        <section className="space-y-4">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider">Links</h2>
          <div className="flex flex-wrap gap-3">
            <a
              className="flex items-center gap-2 border border-black bg-white px-4 py-2 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
              href={site.github}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>GitHub</span>
              <span>→</span>
            </a>
            <a
              className="flex items-center gap-2 border border-black bg-white px-4 py-2 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
              href={site.email}
            >
              <span>Email</span>
              <span>→</span>
            </a>
            <Link
              className="flex items-center gap-2 border border-black bg-white px-4 py-2 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
              href="/blog/"
            >
              <span>Blog</span>
              <span>→</span>
            </Link>
            <Link
              className="flex items-center gap-2 border border-black bg-white px-4 py-2 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
              href="/blog/series/nextmini/"
            >
              <span>Nextmini series</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />

        <div className="border border-black bg-gray-50 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
          <p className="font-mono text-sm text-gray-600">
            Read the <Link className="font-medium text-black underline hover:no-underline" href="/blog/">blog</Link> or browse the{" "}
            <Link className="font-medium text-black underline hover:no-underline" href="/projects/">
              projects
            </Link>{" "}
            page for the parts of this site that change most often.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
