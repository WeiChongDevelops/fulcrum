/**
 * Transparent obstruction that prevents users from interacting with anything outside the form/modal while it's open.
 */
export default function ActiveFormClickShield() {
  return <div className="shield fixed w-screen h-screen bg-transparent left-0 top-0"></div>;
}
