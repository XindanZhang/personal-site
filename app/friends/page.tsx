import { PromptSection } from "../../components/prompt-section";
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
        <PromptSection command="cat /etc/bookmarks.txt">
          <h1 className="shell-heading">Bookmarks</h1>
          <p className="shell-copy">{site.friendsIntro}</p>
          <div className="friends-grid">
            {site.friends.map((friend) => (
              <a
                key={friend.name}
                className="friend-entry"
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
          <p className="shell-copy">
            The list stays short on purpose. I keep references here only when they still shape how I write, build, or
            test things on this site.
          </p>
        </PromptSection>
      </div>
    </SiteLayout>
  );
}
