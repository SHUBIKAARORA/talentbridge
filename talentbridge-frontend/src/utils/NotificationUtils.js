export function getTimeAgo(time) {
  const now = new Date();
  const created = new Date(time);

  const diffMs = now - created;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;

  const days = Math.floor(diffHours / 24);
  return `${days} days ago`;
}