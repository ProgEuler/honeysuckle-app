// The actual chat screen is at /chatpages. This tab is just a launcher;
// navigation is intercepted in app/(tabs)/_layout.tsx via the chat tab's
// tabPress listener so we don't trigger an unhandled GO_BACK warning.
export default function Chat() {
    return null;
}