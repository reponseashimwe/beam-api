import { User } from "@prisma/client";
import Link from "next/link";

function Links({ user }: { user: User | null }) {
  return (
    <>
      {user && user.isAdmin === false && (
        // Logged in user links
        <>
          <Link className="py-2" href="/dashboard">
            Dashboard
          </Link>
          <Link className="py-2" href="/explore">
            Explore
          </Link>
          <Link className="py-2" href="/calendar">
            Calendar
          </Link>
          <Link className="py-2" href="/events">
            My Events
          </Link>
        </>
      )}
      {user && user.isAdmin && (
        // Admin links
        <>
          <Link className="py-2" href="/dashboard">
            Dashboard
          </Link>
          <Link className="py-2" href="/events">
            Events
          </Link>

          <Link className="py-2" href="/verifications">
            Verifications
          </Link>
          <Link className="py-2" href="/categories">
            Categories
          </Link>
        </>
      )}

      {/* Links for unlogged in user */}
      {user == null && (
        <>
          <Link className="py-2" href="/#features">
            Features
          </Link>
          <Link className="py-2" href="/#categories">
            Categories
          </Link>
          <Link className="py-2" href="/explore">
            Explore
          </Link>
        </>
      )}
    </>
  );
}

export default Links;
