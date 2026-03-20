import { PromptSection } from "../../components/prompt-section";
import { SiteLayout } from "../../components/site-layout";
import { site } from "../../lib/site";

export default function FriendsPage() {
  return (
    <SiteLayout active="friends">
      <div className="bookmark-terminal">
        <PromptSection command="cat /etc/bookmarks.txt">
          <h1 className="shell-heading">Bookmarks</h1>
          <p className="shell-copy">{site.friendsIntro}</p>
          <div className="bookmark-list">
            {site.friends.map((friend, index) => (
              <a
                key={friend.name}
                className="bookmark-row"
                href={friend.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="bookmark-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="bookmark-name">{friend.name}</span>
                <span className="bookmark-note">{friend.note}</span>
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
