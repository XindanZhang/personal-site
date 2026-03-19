import { SectionHeading } from "../../components/section-heading";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

function FriendBadge({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-black bg-gray-100 font-mono text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]">
      {initials}
    </div>
  );
}

export default function FriendsPage() {
  return (
    <SiteLayout active="friends">
      <section>
        <SectionHeading as="h1" title="Friends" />
        <p className="mb-6 font-mono text-sm">{site.friendsIntro}</p>

        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          {site.friends.map((friend) => (
            <a
              key={friend.name}
              className="flex items-center gap-4 border border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.2)]"
              href={friend.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FriendBadge name={friend.name} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-mono text-base font-bold">{friend.name}</h3>
                <p className="truncate font-mono text-sm text-gray-600">{friend.note}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
