/**
 * Transparent obstructor that prevents users from interacting with anything outside the form/modal while it's open.
 */
export default function ActiveFormClickShield() {
    return (
        <div className="absolute w-screen h-screen bg-transparent z-3"></div>
    );
}