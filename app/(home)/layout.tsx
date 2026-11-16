import Landing from "@/components/landing/Landing";

/**
 * The landing stays mounted for both / and /learning: the Learning index is an overlay on
 * top of it (blurred behind the panel), so opening and closing it never reloads the page.
 */
export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Landing />
      {children}
    </>
  );
}
