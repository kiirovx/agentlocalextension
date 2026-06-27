interface Props {
  role: "user" | "assistant" | "tool";
}

export default function Avatar({ role }: Props) {
  const emoji = role === "user" ? "👤" : role === "tool" ? "🔧" : "🤖";
  return <span className="avatar">{emoji}</span>;
}
