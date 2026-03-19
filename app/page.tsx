import Link from "next/link";
import { ProjectCard } from "../components/project-card";
import { SectionHeading } from "../components/section-heading";
import { SiteLayout } from "../components/site-layout";
import { getProjectsByStatus, site } from "../lib/site";

const buttonClassName =
  "inline-flex items-center justify-center gap-1.5 border border-black px-3 py-1 font-mono text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";

export default function HomePage() {
  const featuredProject = getProjectsByStatus("featured")[0];

  return (
    <SiteLayout active="home">
      <div className="space-y-6">
        <section>
          <SectionHeading as="h1" title="Hello" />

          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-[2fr_1fr]">
            <div>
              <div className="space-y-4">
                <p className="font-mono text-sm">{site.titleSuffix}</p>
                <blockquote className="border-l-4 border-black bg-gray-50 py-2 pl-4 font-mono text-sm">
                  <em>{site.home.quote}</em>
                </blockquote>
                <p className="font-mono text-sm">{site.home.body}</p>

                <div className="flex items-center gap-4">
                  <a
                    className={`${buttonClassName} bg-[#d4a72c] text-black`}
                    href={site.email}
                  >
                    Contact
                    <span aria-hidden="true">→</span>
                  </a>
                  <span className="font-mono text-xs text-gray-500">{site.availability}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="border border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                <div className="border-b border-black px-4 py-2 font-mono text-sm font-bold">
                  {site.home.sideTitle}
                </div>
                <ul className="divide-y divide-black">
                  {site.home.sideNotes.map((note) => (
                    <li key={note} className="border-l-4 border-l-gray-500 px-4 py-2 font-mono text-sm">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />

        <section>
          <SectionHeading title="Blog" />
          <p className="mb-4 font-mono text-sm">{site.home.blogSummary}</p>
          <Link className={`${buttonClassName} bg-[#177a45] text-white`} href="/blog/">
            View All Posts
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />

        <section>
          <SectionHeading title="Projects" />
          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <p className="font-mono text-sm">{site.home.projectsSummary}</p>
              <Link className={`${buttonClassName} bg-[#f2572b] text-white`} href="/projects/">
                View All Projects
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {featuredProject ? (
              <div>
                <ProjectCard project={featuredProject} />
              </div>
            ) : null}
          </div>
        </section>

        <hr className="my-4 w-full border-0 border-t border-dotted border-gray-400" />

        <section>
          <SectionHeading title="Contact" />
          <table className="w-full border-collapse font-mono text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
            <tbody>
              <tr className="border border-black border-l-4 border-l-[#3498db]">
                <td className="w-24 border-r border-black bg-white px-3 py-2 font-bold">Email</td>
                <td className="bg-white px-3 py-2">
                  <a className="hover:underline" href={site.email}>
                    xindan.zhang@mail.utoronto.ca
                  </a>
                </td>
              </tr>
              <tr className="border border-t-0 border-black border-l-4 border-l-[#3498db]">
                <td className="w-24 border-r border-black bg-white px-3 py-2 font-bold">GitHub</td>
                <td className="bg-white px-3 py-2">
                  <a className="hover:underline" href={site.github} rel="noopener noreferrer" target="_blank">
                    XindanZhang
                  </a>
                </td>
              </tr>
              <tr className="border border-t-0 border-black border-l-4 border-l-[#3498db]">
                <td className="w-24 border-r border-black bg-white px-3 py-2 font-bold">Archive</td>
                <td className="bg-white px-3 py-2">
                  <Link className="hover:underline" href="/blog/">
                    /blog/
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </SiteLayout>
  );
}
