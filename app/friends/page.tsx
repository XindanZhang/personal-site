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

  return <div className="friend-badge">{initials}</div>;
}

export default function FriendsPage() {
  return (
    <SiteLayout active="friends">
      <div className="page-stack">
        <section>
          <SectionHeading as="h1" eyebrow="Library" title="Reading list" />
          <p className="section-copy">{site.friendsIntro}</p>
        </section>

        <div className="friends-grid">
          {site.friends.map((friend) => (
            <a
              key={friend.name}
              className="friend-entry transition-transform duration-150 hover:-translate-y-0.5"
              href={friend.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FriendBadge name={friend.name} />
              <div className="min-w-0 flex-1">
                <h2 className="friend-name">{friend.name}</h2>
                <p className="friend-note">{friend.note}</p>
              </div>
            </a>
          ))}
        </div>

        <section className="surface-note">
          The list stays deliberately short. I only keep references here when they actively shape the way I write,
          build, or test things on this site.
        </section>
      </div>
    </SiteLayout>
  );
}
